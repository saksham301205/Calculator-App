(() => {
  const previousEl = document.getElementById('previous');
  const currentEl = document.getElementById('current');
  const buttons = document.getElementById('buttons');

  let current = '0';
  let previous = '';
  let operator = null;
  let justEvaluated = false;

  function updateDisplay() {
    currentEl.textContent = current;
    previousEl.textContent = previous && operator ? `${previous} ${symbolFor(operator)}` : previous;
  }

  function symbolFor(op) {
    switch(op){
      case '+': return '+';
      case '-': return '−';
      case '*': return '×';
      case '/': return '÷';
      default: return op;
    }
  }

  function clearAll(){ current = '0'; previous = ''; operator = null; justEvaluated = false; }

  function appendNumber(n){
    if(justEvaluated){ current = n === '.' ? '0.' : n; justEvaluated = false; return; }
    if(n === '.' && current.includes('.')) return;
    if(current === '0' && n !== '.') current = n; else current = current + n;
  }

  function chooseOperator(op){
    if(operator && !justEvaluated){ compute(); }
    operator = op;
    previous = current;
    current = '0';
  }

  function compute(){
    if(!operator || previous === '') return;
    const a = parseFloat(previous);
    const b = parseFloat(current);
    if(Number.isNaN(a) || Number.isNaN(b)) return;
    let res;
    switch(operator){
      case '+': res = a + b; break;
      case '-': res = a - b; break;
      case '*': res = a * b; break;
      case '/': res = b === 0 ? 'Error' : a / b; break;
      default: return;
    }
    current = formatResult(res);
    previous = '';
    operator = null;
    justEvaluated = true;
  }

  function formatResult(v){
    if(v === 'Error') return 'Error';
    if(!isFinite(v)) return 'Error';
    // Limit precision sensibly
    const rounded = Math.round((v + Number.EPSILON) * 1e12) / 1e12;
    return String(rounded);
  }

  function backspace(){
    if(justEvaluated){ current = '0'; justEvaluated = false; return; }
    if(current.length === 1) current = '0'; else current = current.slice(0, -1);
  }

  function percent(){
    const num = parseFloat(current);
    if(Number.isNaN(num)) return;
    current = formatResult(num / 100);
  }

  function negate(){
    if(current === '0') return;
    if(current.startsWith('-')) current = current.slice(1); else current = '-' + current;
  }

  buttons.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if(!btn) return;
    const action = btn.dataset.action;
    const val = btn.dataset.value ?? btn.textContent.trim();
    if(action === 'number') appendNumber(val);
    else if(action === 'decimal') appendNumber('.');
    else if(action === 'operator') chooseOperator(btn.dataset.value);
    else if(action === 'clear') clearAll();
    else if(action === 'backspace') backspace();
    else if(action === 'percent') percent();
    else if(action === 'negate') negate();
    else if(action === 'equals') compute();
    updateDisplay();
  });

  // Keyboard support
  window.addEventListener('keydown', (e) => {
    if(e.key >= '0' && e.key <= '9'){ appendNumber(e.key); updateDisplay(); return; }
    if(e.key === '.') { appendNumber('.'); updateDisplay(); return; }
    if(e.key === 'Enter' || e.key === '='){ compute(); updateDisplay(); return; }
    if(e.key === 'Backspace'){ backspace(); updateDisplay(); return; }
    if(e.key === 'Escape'){ clearAll(); updateDisplay(); return; }
    if(e.key === '%'){ percent(); updateDisplay(); return; }
    if(e.key === '+'||e.key === '-'||e.key === '*'||e.key === '/'){
      chooseOperator(e.key); updateDisplay(); return;
    }
  });

  // init
  clearAll();
  updateDisplay();

})();
