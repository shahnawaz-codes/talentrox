import Editor from "@monaco-editor/react";
import { Loader2Icon, PlayIcon, Sparkles } from "lucide-react";
import { LANGUAGE_CONFIG } from "../data/problems";

function CodeEditorPanel({
  selectedLanguage,
  code,
  isRunning,
  isAnalyzing,
  onLanguageChange,
  onCodeChange,
  onRunCode,
  onAnalyzeCode,
}) {
  return (
    <div className="h-full bg-base-300 flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 bg-base-100 border-t border-base-300">
        <div className="flex items-center gap-3">
          <img
            src={LANGUAGE_CONFIG[selectedLanguage]?.icon}
            alt={LANGUAGE_CONFIG[selectedLanguage]?.name}
            className="size-6"
          />
          <select
            className="select select-sm"
            value={selectedLanguage}
            onChange={onLanguageChange}
          >
            {/*convert object entries to array like this ['js',{name:'javascript',.....}] len:2 */}
            {Object.entries(LANGUAGE_CONFIG).map(([key, lang]) => (
              <option key={key} value={key}>
                {key.toUpperCase()} - {lang.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          {onAnalyzeCode && (
            <button
              className="btn btn-sm gap-2 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 hover:border-primary transition-all shadow-[0_0_12px_rgba(30,184,84,0.15)] hover:shadow-[0_0_20px_rgba(30,184,84,0.3)] hover:scale-105"
              disabled={isRunning || isAnalyzing}
              onClick={onAnalyzeCode}
              title="Analyze code with Gemini AI for Big-O complexity, bugs, and edge cases"
            >
              {isAnalyzing ? (
                <>
                  <Loader2Icon className="size-4 animate-spin text-primary" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="size-4 text-primary" />
                  <span>Analyze Code</span>
                </>
              )}
            </button>
          )}

          <button
            className="btn btn-primary btn-sm gap-2"
            disabled={isRunning || isAnalyzing}
            onClick={onRunCode}
          >
            {isRunning ? (
              <>
                <Loader2Icon className="size-4 animate-spin" />
                Running...
              </>
            ) : (
              <>
                <PlayIcon className="size-4" />
                Run Code
              </>
            )}
          </button>
        </div>
      </div>


      <div className="flex-1">
        <Editor
          height={"100%"}
          language={LANGUAGE_CONFIG[selectedLanguage].monacoLang}
          value={code}
          onChange={onCodeChange}
          theme="vs-dark"
          options={{
            fontSize: 16,
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            automaticLayout: true,
            minimap: { enabled: false },
            wordWrap: "on",
            tabSize: 2,
            insertSpaces: true,
            detectIndentation: false,
            smoothScrolling: true,
            cursorSmoothCaretAnimation: true,
            scrollbar: {
              alwaysConsumeMouseWheel: false,
            },
          }}
        />
      </div>
    </div>
  );
}
export default CodeEditorPanel;
