import { useState } from "react";
import { NCCard } from "./NCCard";
import { Btn } from "./Btn";
import { Bar } from "./Bar";
import { Chip } from "./Chip";
import {
  LEARNING_SECTIONS,
  QUIZ_QUESTIONS,
  QUIZ_PASS_THRESHOLD,
} from "@/lib/data";

interface LearningModuleProps {
  onComplete: (score: number, passed: boolean) => void;
  onClose: () => void;
}

type Phase = "reading" | "quiz" | "result";

export function LearningModule({ onComplete, onClose }: LearningModuleProps) {
  const [phase, setPhase] = useState<Phase>("reading");
  const [sectionIndex, setSectionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const section = LEARNING_SECTIONS[sectionIndex];
  const isLastSection = sectionIndex === LEARNING_SECTIONS.length - 1;

  const score = quizSubmitted
    ? QUIZ_QUESTIONS.reduce(
        (s, q, i) => s + (answers[i] === q.correctIndex ? 1 : 0),
        0
      )
    : 0;
  const passed = score >= QUIZ_PASS_THRESHOLD;

  const handleSubmitQuiz = () => {
    setQuizSubmitted(true);
    setPhase("result");
    const finalScore = QUIZ_QUESTIONS.reduce(
      (s, q, i) => s + (answers[i] === q.correctIndex ? 1 : 0),
      0
    );
    const finalPassed = finalScore >= QUIZ_PASS_THRESHOLD;
    onComplete(finalScore, finalPassed);
  };

  const handleRetry = () => {
    setAnswers({});
    setQuizSubmitted(false);
    setPhase("quiz");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <NCCard glow className="relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-muted-foreground hover:text-foreground text-lg"
          >
            ✕
          </button>

          <div className="mb-1 flex items-center gap-2">
            <span className="text-lg font-extrabold text-foreground">📚 Web3 Basics Module</span>
            <Chip variant="green">Learning</Chip>
          </div>

          {phase === "reading" && (
            <>
              <div className="mt-1 mb-4 text-xs text-muted-foreground">
                Section {sectionIndex + 1} of {LEARNING_SECTIONS.length}
              </div>
              <Bar pct={((sectionIndex + 1) / LEARNING_SECTIONS.length) * 100} />

              <div className="mt-5 rounded-xl border border-border bg-background p-5">
                <h3 className="text-base font-bold text-foreground mb-3">{section.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{section.content}</p>
              </div>

              <div className="mt-4 flex gap-2">
                {sectionIndex > 0 && (
                  <Btn
                    variant="ghost"
                    onClick={() => setSectionIndex((i) => i - 1)}
                    className="px-4"
                  >
                    ← Back
                  </Btn>
                )}
                <div className="flex-1" />
                {isLastSection ? (
                  <Btn onClick={() => setPhase("quiz")}>Start Quiz →</Btn>
                ) : (
                  <Btn onClick={() => setSectionIndex((i) => i + 1)}>
                    Next →
                  </Btn>
                )}
              </div>
            </>
          )}

          {phase === "quiz" && (
            <>
              <div className="mt-1 mb-4 text-xs text-muted-foreground">
                Answer {QUIZ_QUESTIONS.length} questions · Need {QUIZ_PASS_THRESHOLD} correct to pass
              </div>

              <div className="flex flex-col gap-4">
                {QUIZ_QUESTIONS.map((q, qi) => (
                  <div
                    key={qi}
                    className="rounded-xl border border-border bg-background p-4"
                  >
                    <div className="mb-3 text-sm font-semibold text-foreground">
                      {qi + 1}. {q.question}
                    </div>
                    <div className="flex flex-col gap-2">
                      {q.options.map((opt, oi) => (
                        <button
                          key={oi}
                          onClick={() =>
                            setAnswers((a) => ({ ...a, [qi]: oi }))
                          }
                          className={`w-full text-left rounded-lg border px-3.5 py-2.5 text-[13px] transition-all duration-200 ${
                            answers[qi] === oi
                              ? "border-primary bg-accent text-primary font-semibold"
                              : "border-border bg-secondary text-muted-foreground hover:border-border-bright hover:text-foreground"
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex gap-2">
                <Btn variant="ghost" onClick={() => setPhase("reading")} className="px-4">
                  ← Back to Content
                </Btn>
                <div className="flex-1" />
                <Btn
                  onClick={handleSubmitQuiz}
                  disabled={Object.keys(answers).length < QUIZ_QUESTIONS.length}
                >
                  Submit Quiz
                </Btn>
              </div>
            </>
          )}

          {phase === "result" && (
            <>
              <div className="mt-5 rounded-xl border border-border bg-background p-6 text-center">
                <div className="text-4xl mb-3">{passed ? "🎉" : "😔"}</div>
                <div className="text-lg font-bold text-foreground mb-1">
                  {passed ? "Congratulations!" : "Not quite there yet"}
                </div>
                <div className="text-sm text-muted-foreground mb-4">
                  You scored {score}/{QUIZ_QUESTIONS.length}
                  {passed
                    ? " — you've passed the Web3 Basics Module!"
                    : ` — you need at least ${QUIZ_PASS_THRESHOLD} to pass.`}
                </div>
                <Bar pct={(score / QUIZ_QUESTIONS.length) * 100} />

                <div className="mt-5">
                  {passed ? (
                    <Btn variant="success" onClick={onClose} className="w-full justify-center">
                      ✓ Module Complete — Close
                    </Btn>
                  ) : (
                    <Btn onClick={handleRetry} className="w-full justify-center">
                      Retry Quiz
                    </Btn>
                  )}
                </div>
              </div>
            </>
          )}
        </NCCard>
      </div>
    </div>
  );
}
