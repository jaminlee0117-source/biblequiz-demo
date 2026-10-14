(() => {
  const ALL = window.QUESTIONS;
  const MODE = {
    PERSON: "모드 1 · 인물 이름 맞추기",
    INITIAL: "모드 2 · 초성 퀴즈",
    BLANK: "모드 3 · 빈칸 채우기"
  };
  const MODE_ORDER = ["PERSON", "INITIAL", "BLANK"];
  let Q = [];            // 선택한 모드의 문항
  const NEXT_DELAY = 800;     // 정답 후 자동 전환 (PRD 3.2)
  const REVEAL_DELAY = 1200;  // → 키로 정답 공개 후 전환
  const IDLE_CHECK = 1000;    // 초성 입력: 글자 수는 찼지만 오답일 때 판정 대기

  const $ = id => document.getElementById(id);
  const stage = $("stage"), feedback = $("feedback");

  const el = (tag, cls, text) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  };
  const shuffle = arr => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  // 정답이 항상 1번에 오지 않도록 보기 순서를 섞어 둔다
  ALL.forEach(q => { if (q.options) q.shuffled = shuffle(q.options); });

  let idx = -1;          // -1: 모드 선택 화면, Q.length: 종료 화면
  let ready = false;     // 삽화 프리로드 완료 여부
  let locked = false;    // 현재 문항 판정 완료 여부
  let gen = 0;           // 문항이 바뀌면 증가 → 이전 타이머 무효화
  let view = null;       // 현재 문항의 { pick(i), reveal(), input? }
  const solved = new Set();

  const later = (fn, ms) => { const g = gen; setTimeout(() => { if (g === gen) fn(); }, ms); };

  function flash(kind, msg) {
    stage.classList.remove("ok", "bad");
    void stage.offsetWidth; // 애니메이션 재시작
    stage.classList.add(kind);
    feedback.className = "feedback " + kind;
    feedback.textContent = msg;
  }

  function correct(q) {
    if (locked) return;
    locked = true;
    solved.add(q.id);
    flash("ok", "정답! 🎉");
    later(next, NEXT_DELAY);
  }

  function wrong(q) {
    flash("bad", "다시! 힌트: " + q.hint);
  }

  function reveal() {
    if (idx < 0 || idx >= Q.length) return;
    if (locked) return next();
    locked = true;
    view.reveal();
    flash("ok", "정답: " + Q[idx].answer);
    later(next, REVEAL_DELAY);
  }

  const next = () => go(idx + 1);

  function header() {
    const n = Q.length;
    const q = Q[idx];
    $("progress").style.width = idx < 0 ? "0%" : Math.min(100, ((idx + 1) / n) * 100) + "%";
    $("counter").textContent = q ? String(idx + 1).padStart(2, "0") + " / " + n : "";
    $("mode").textContent = q ? MODE[q.type] : "";
  }

  function go(i) {
    if (i < 0 || i > Q.length) return;
    gen++;
    idx = i;
    locked = false;
    stage.classList.remove("ok", "bad");
    feedback.className = "feedback";
    feedback.textContent = "";
    stage.replaceChildren();
    header();
    if (idx === Q.length) return renderEnd();
    const q = Q[idx];
    view = { PERSON: renderPerson, INITIAL: renderInitial, BLANK: renderBlank }[q.type](q);
  }

  // 객관식 버튼 묶음 (모드 1, 3 공용)
  function optionButtons(q, onPick) {
    const wrap = el("div", q.type === "PERSON" ? "opts" : "chips");
    const btns = q.shuffled.map((opt, i) => {
      const b = el("button", "btn");
      b.append(el("span", "n", i + 1), opt);
      b.onclick = () => pick(i);
      wrap.append(b);
      return b;
    });
    function pick(i) {
      const b = btns[i];
      if (locked || !b || b.disabled) return;
      const ok = q.shuffled[i] === q.answer;
      onPick(q.shuffled[i], ok);
      if (ok) { b.classList.add("ok"); correct(q); }
      else { b.classList.add("bad"); b.disabled = true; wrong(q); }
    }
    function markAnswer() {
      btns[q.shuffled.indexOf(q.answer)].classList.add("ok");
      btns.forEach(b => (b.disabled = true));
    }
    return { wrap, pick, markAnswer };
  }

  function renderPerson(q) {
    const box = el("div", "person");
    const img = el("img");
    img.src = q.image;
    img.alt = "";
    const right = el("div");
    const ob = optionButtons(q, () => {});
    right.append(el("p", "q", q.question), ob.wrap);
    box.append(img, right);
    stage.append(box);
    return { pick: ob.pick, reveal: ob.markAnswer };
  }

  function renderBlank(q) {
    const box = el("div", "center");
    const verse = el("p", "verse");
    const [before, after] = q.verseTemplate.split("[ ]");
    const blank = el("span", "blank", "?");
    verse.append(before, blank, after);
    const ob = optionButtons(q, (word, ok) => {
      blank.textContent = word;
      blank.className = "blank " + (ok ? "ok" : "bad");
      if (!ok) later(() => { if (!locked) { blank.textContent = "?"; blank.className = "blank"; } }, 800);
    });
    box.append(verse, ob.wrap);
    stage.append(box);
    return {
      pick: ob.pick,
      reveal() {
        blank.textContent = q.answer;
        blank.className = "blank ok";
        ob.markAnswer();
      }
    };
  }

  function renderInitial(q) {
    const box = el("div", "center");
    const input = el("input", "answer-input");
    input.autocomplete = "off";
    input.spellcheck = false;
    input.placeholder = "＿".repeat(q.answer.length);
    input.style.width = q.answer.length * 1.3 + 0.8 + "em";
    box.append(el("p", "q", q.question), el("p", "initial", q.initial), input);
    stage.append(box);

    let timer = null;
    let resetting = false;
    const g = gen;

    // 오답: 입력을 비우고 재입력 대기. blur로 IME 조합을 먼저 끝낸다.
    const fail = () => {
      if (locked || g !== gen) return;
      wrong(q);
      resetting = true;
      input.blur();
      input.value = "";
      resetting = false;
      input.focus();
    };

    // Enter 없이 매 입력마다 검사. value에는 조합 중인 글자도 포함된다.
    input.addEventListener("input", () => {
      if (locked || resetting) return;
      clearTimeout(timer);
      const v = input.value.replace(/\s/g, "");
      if (v === q.answer) {
        input.classList.add("ok");
        resetting = true;
        input.blur();
        resetting = false;
        input.value = q.answer;
        correct(q);
        return;
      }
      // 글자 수를 채웠는데 오답이고 마지막 글자가 완성형 음절이면 잠시 후 오답 처리
      const last = v.charCodeAt(v.length - 1);
      if (v.length >= q.answer.length && last >= 0xac00 && last <= 0xd7a3) {
        timer = setTimeout(fail, IDLE_CHECK);
      }
    });

    setTimeout(() => input.focus(), 0);
    return {
      input,
      pick() {},
      reveal() {
        clearTimeout(timer);
        resetting = true;
        input.blur();
        resetting = false;
        input.value = q.answer;
        input.classList.add("ok");
      }
    };
  }

  // 시작 화면: 3개 모드 중 선택
  function menu() {
    gen++;
    idx = -1;
    Q = [];
    locked = false;
    stage.classList.remove("ok", "bad");
    feedback.className = "feedback";
    feedback.textContent = "";
    stage.replaceChildren();
    header();
    const box = el("div", "center");
    const modes = el("div", "modes");
    MODE_ORDER.forEach((type, i) => {
      const b = el("button", "btn mode");
      const count = ALL.filter(q => q.type === type).length;
      b.append(el("span", "n", i + 1), el("span", null, MODE[type].split(" · ")[1]), el("small", null, count + "문항"));
      b.disabled = !ready;
      b.onclick = () => startMode(type);
      modes.append(b);
    });
    box.append(
      el("h1", null, "📖 성경 퀴즈"),
      el("p", "sub", ready ? "퀴즈를 선택하세요 (1~3)" : "불러오는 중…"),
      modes
    );
    stage.append(box);
  }

  function startMode(type) {
    if (!ready) return;
    Q = ALL.filter(q => q.type === type);
    solved.clear();
    go(0);
  }

  function renderEnd() {
    const box = el("div", "center");
    const again = el("button", "btn primary", "다시 하기 (R)");
    again.onclick = restart;
    const back = el("button", "btn", "모드 선택 (Esc)");
    back.onclick = menu;
    const row = el("div", "chips");
    row.append(again, back);
    box.append(
      el("h1", null, "수고하셨습니다! 🙌"),
      el("div", "score", solved.size + " / " + Q.length),
      row
    );
    stage.append(box);
  }

  function restart() {
    solved.clear();
    go(0);
  }

  function toggleTheme() {
    const r = document.documentElement;
    r.dataset.theme = r.dataset.theme === "light" ? "dark" : "light";
  }

  // e.code 기준: 한글 IME 조합 중에도 물리 키를 정확히 식별
  document.addEventListener("keydown", e => {
    const inInput = e.target.tagName === "INPUT";
    const code = e.code;

    if (code === "KeyT" && !inInput) return toggleTheme();

    if (idx < 0) {
      const m = /^(?:Digit|Numpad)([1-3])$/.exec(code);
      if (m) { e.preventDefault(); startMode(MODE_ORDER[Number(m[1]) - 1]); }
      return;
    }

    if (code === "Escape") {
      e.preventDefault();
      if (inInput) e.target.blur();
      return menu();
    }

    if (code === "Space" || code === "ArrowRight" || code === "ArrowLeft") {
      e.preventDefault();
      if (inInput) e.target.blur();
      if (code === "Space") return idx < Q.length ? next() : undefined;
      if (code === "ArrowRight") return idx < Q.length ? reveal() : undefined;
      return go(idx - 1);
    }

    if (inInput) return;

    if (idx === Q.length) {
      if (code === "KeyR" || code === "Enter") { e.preventDefault(); restart(); }
      return;
    }

    const m = /^(?:Digit|Numpad)([1-4])$/.exec(code);
    if (m) { e.preventDefault(); view.pick(Number(m[1]) - 1); }
  });

  menu();

  // 모든 삽화를 미리 불러온 뒤 모드 선택 활성화 (실패해도 시작은 가능)
  Promise.all(ALL.filter(q => q.image).map(q => new Promise(res => {
    const im = new Image();
    im.onload = im.onerror = res;
    im.src = q.image;
  }))).then(() => {
    ready = true;
    if (idx < 0) menu();
  });
})();
