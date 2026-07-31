import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Operation = '+' | '-' | '×' | '÷' | null;

function App() {
  const [num1, setNum1] = useState<string>('');
  const [num2, setNum2] = useState<string>('');
  const [operation, setOperation] = useState<Operation>(null);
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const calculate = useCallback(() => {
    const n1 = parseFloat(num1);
    const n2 = parseFloat(num2);

    if (isNaN(n1) || isNaN(n2)) {
      setResult(null);
      setError(null);
      return;
    }

    if (!operation) {
      setResult(null);
      setError(null);
      return;
    }

    setError(null);

    switch (operation) {
      case '+':
        setResult(n1 + n2);
        break;
      case '-':
        setResult(n1 - n2);
        break;
      case '×':
        setResult(n1 * n2);
        break;
      case '÷':
        if (n2 === 0) {
          setError('Cannot divide by zero');
          setResult(null);
        } else {
          setResult(n1 / n2);
        }
        break;
    }
  }, [num1, num2, operation]);

  useEffect(() => {
    calculate();
  }, [calculate]);

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Number keys for first input if it's focused
      if (e.key >= '0' && e.key <= '9') return;
      if (e.key === '.' || e.key === '-') return;

      // Operator keys
      if (e.key === '+' || e.key === 'Add') {
        e.preventDefault();
        setOperation('+');
      } else if (e.key === '-' || e.key === 'Subtract') {
        e.preventDefault();
        setOperation('-');
      } else if (e.key === '*' || e.key === 'Multiply') {
        e.preventDefault();
        setOperation('×');
      } else if (e.key === '/' || e.key === 'Divide') {
        e.preventDefault();
        setOperation('÷');
      } else if (e.key === 'Enter') {
        e.preventDefault();
        calculate();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setNum1('');
        setNum2('');
        setOperation(null);
        setResult(null);
        setError(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [calculate]);

  const handleOperationClick = (op: Operation) => {
    setOperation(op);
  };

  const formatResult = (value: number): string => {
    // Handle very large or very small numbers
    if (Math.abs(value) > 999999999 || (Math.abs(value) < 0.000001 && value !== 0)) {
      return value.toExponential(6);
    }
    
    // Round to 8 decimal places to avoid floating point errors
    const rounded = Math.round(value * 100000000) / 100000000;
    
    // Format with appropriate decimals
    return rounded.toString();
  };

  return (
    <div className="min-h-[100dvh] w-full flex items-center justify-center bg-background p-4 sm:p-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12"
        >
          <h1 className="font-mono text-2xl font-semibold tracking-tight text-foreground mb-2">
            Calculatrice
          </h1>
          <p className="text-sm text-muted-foreground tracking-wide">
            Precision arithmetic
          </p>
        </motion.div>

        {/* Calculator Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="bg-card border border-card-border rounded-2xl p-8 shadow-xl"
        >
          {/* Input Fields */}
          <div className="space-y-4 mb-8">
            <div>
              <label htmlFor="num1" className="block text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
                First Number
              </label>
              <input
                id="num1"
                data-testid="input-num1"
                type="number"
                value={num1}
                onChange={(e) => setNum1(e.target.value)}
                placeholder="0"
                className="w-full bg-background border border-input rounded-xl px-4 py-3.5 font-mono text-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              />
            </div>

            <div>
              <label htmlFor="num2" className="block text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
                Second Number
              </label>
              <input
                id="num2"
                data-testid="input-num2"
                type="number"
                value={num2}
                onChange={(e) => setNum2(e.target.value)}
                placeholder="0"
                className="w-full bg-background border border-input rounded-xl px-4 py-3.5 font-mono text-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              />
            </div>
          </div>

          {/* Operation Buttons */}
          <div className="mb-8">
            <label className="block text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">
              Operation
            </label>
            <div className="grid grid-cols-4 gap-3">
              {[
                { op: '+' as Operation, label: '+', key: 'add' },
                { op: '-' as Operation, label: '−', key: 'subtract' },
                { op: '×' as Operation, label: '×', key: 'multiply' },
                { op: '÷' as Operation, label: '÷', key: 'divide' },
              ].map(({ op, label, key }) => (
                <motion.button
                  key={key}
                  data-testid={`button-operation-${key}`}
                  onClick={() => handleOperationClick(op)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  className={`
                    relative aspect-square rounded-xl font-mono text-2xl font-semibold
                    transition-all duration-200 overflow-hidden
                    ${
                      operation === op
                        ? 'bg-primary text-primary-foreground shadow-lg'
                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    }
                  `}
                >
                  <span className="relative z-10">{label}</span>
                  {operation === op && (
                    <motion.div
                      layoutId="operation-indicator"
                      className="absolute inset-0 bg-primary"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Result Display */}
          <div className="relative">
            <label className="block text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">
              Result
            </label>
            <div
              className={`
                relative bg-background/50 rounded-xl px-6 py-6 min-h-[80px] 
                flex items-center justify-center border transition-all duration-300
                ${error ? 'border-destructive/50' : result !== null ? 'border-primary/30 result-glow' : 'border-input'}
              `}
            >
              <AnimatePresence mode="wait">
                {error ? (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    data-testid="text-error"
                    className="text-destructive text-sm font-medium text-center"
                  >
                    {error}
                  </motion.div>
                ) : result !== null ? (
                  <motion.div
                    key={result}
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -10 }}
                    transition={{
                      duration: 0.4,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    data-testid="text-result"
                    className="font-mono text-3xl font-semibold text-primary tabular-nums"
                  >
                    {formatResult(result)}
                  </motion.div>
                ) : (
                  <motion.div
                    key="placeholder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-muted-foreground/50 text-lg font-mono"
                  >
                    —
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Keyboard Hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-6 text-center text-xs text-muted-foreground/70"
          >
            Use keyboard: <span className="font-mono">+ - * /</span> for operations, <span className="font-mono">ESC</span> to clear
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default App;
