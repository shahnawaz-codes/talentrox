import Navbar from "../components/Navbar";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

import ProblemDescription from "../components/ProblemDescription";
import CodeEditorPanel from "../components/CodeEditorPanel";
import OutputPanel from "../components/OutputPanel";
import { useEffect, useState } from "react";
import { PROBLEMS } from "../data/problems";
import { useNavigate, useParams } from "react-router";
import { executeCode } from "../lib/piston";
import toast from "react-hot-toast";
import confetti from "canvas-confetti";

function Problem() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  // Validate problem ID and set default if invalid
  const currentProblemId = id && PROBLEMS[id] ? id : "two-sum";
  const [code, setCode] = useState(
    PROBLEMS[currentProblemId].starterCode[selectedLanguage]
  );
  // Get current problem details
  const currentProblem = PROBLEMS[currentProblemId];
  // Update code when problem or language changes
  useEffect(() => {
    setCode(PROBLEMS[currentProblemId].starterCode[selectedLanguage]);
    setOutput(null);
  }, [currentProblemId, selectedLanguage]);

  // navigate to a different problem
  const handleProblemChange = (newProblemId) => {
    navigate(`/problem/${newProblemId}`);
  };
  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    setSelectedLanguage(newLanguage);
    setCode(PROBLEMS[currentProblemId].starterCode[newLanguage]);
    setOutput(null);
  };
  // normalize output for comparison
  const normalizeOutput = (output) => {
    // normalize output for comparison (trim whitespace, handle different spacing)
    return output
      .trim()
      .split("\n")
      .map((line) =>
        line
          .trim()
          // remove spaces after [ and before ]
          .replace(/\[\s+/g, "[")
          .replace(/\s+\]/g, "]")
          // normalize spaces around commas to single space after comma
          .replace(/\s*,\s*/g, ",")
      )
      .filter((line) => line.length > 0)
      .join("\n");
  };
  // check if actual output matches expected output
  const checkIfTestsPassed = (actualOutput, expectedOutput) => {
    return actualOutput == expectedOutput;
  };
  // trigger confetti animation
  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 250,
      origin: { x: 0.2, y: 0.6 },
    });

    confetti({
      particleCount: 80,
      spread: 250,
      origin: { x: 0.8, y: 0.6 },
    });
  };
  useEffect(() => {
    console.log(output);
  }, [output]);
  const handleRunCode = async () => {
    try {
      setOutput(null);
      setIsRunning(true);
      const result = await executeCode(selectedLanguage, code);
      setOutput(result);
      if (result.success) {
        const expectOutput = currentProblem.expectedOutput[selectedLanguage];
        const testsPassed = checkIfTestsPassed(
          normalizeOutput(result.output),
          normalizeOutput(expectOutput)
        );
        if (testsPassed) {
          triggerConfetti();
          toast.success("All test cases passed!");
        } else {
          toast.error("Some test cases failed. Please try again.");
        }
      } else {
        toast.error("Error: " + result.error);
      }
    } catch (error) {
      console.error("Error executing code:", error);
      toast.error("An error occurred while executing the code.");
    } finally {
      setIsRunning(false);
    }
  };
  return (
    <>
      <Navbar />
      <div className="h-screen bg-base-100 flex flex-col ">
        <div className="flex-1 mt-24">
          <PanelGroup direction="horizontal">
            {/* Left panel – Problem Description */}
            <Panel defaultSize={40} minSize={30}>
              <ProblemDescription
                problem={currentProblem}
                currentProblemId={currentProblemId}
                onProblemChange={handleProblemChange}
                allProblems={Object.values(PROBLEMS)}
              />
            </Panel>

            <PanelResizeHandle className="w-2 bg-base-300 hover:bg-primary transition-colors cursor-col-resize" />

            {/* Right panel – Editor + Output */}
            <Panel defaultSize={60} minSize={30}>
              <PanelGroup direction="vertical">
                {/* Code Editor */}
                <Panel defaultSize={70} minSize={30}>
                  <CodeEditorPanel
                    code={code}
                    selectedLanguage={selectedLanguage}
                    isRunning={isRunning}
                    onLanguageChange={handleLanguageChange}
                    onCodeChange={setCode}
                    onRunCode={handleRunCode}
                  />
                </Panel>

                <PanelResizeHandle className="h-2 bg-base-300 hover:bg-primary transition-colors cursor-row-resize" />

                {/* Output */}
                <Panel defaultSize={30} minSize={30}>
                  <OutputPanel output={output} />
                </Panel>
              </PanelGroup>
            </Panel>
          </PanelGroup>
        </div>
      </div>
    </>
  );
}

export default Problem;
