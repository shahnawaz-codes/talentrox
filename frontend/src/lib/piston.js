import axios from "axios";
const PISTON_API = "https://emkc.org/api/v2/piston";

// Supported languages and their versions
const LANGUAGE_VERSIONS = {
  javascript: { language: "javascript", version: "18.15.0" },
  python: { language: "python", version: "3.10.0" },
  java: { language: "java", version: "15.0.2" },
};
// extension to language mapping
const getFileExtension = (language) => {
  const extension = {
    javascript: "js",
    python: "py",
    java: "java",
  };
  return extension[language];
};

// ----------------------jsDoc type-------------------
/**
 *
 * @param {string} language
 * @param {string} code
 * @returns {Promise<{success:boolean,output?:string,error?:string}}
 */

export const executeCode = async (language, code) => {
  try {
    const languageConfig = LANGUAGE_VERSIONS[language];
    if (!languageConfig) {
      return {
        success: false,
        error: `Unsupported language: ${language}`,
      };
    }

    const res = await axios.post(`${PISTON_API}/execute`, {
      language: languageConfig.language,
      version: languageConfig.version,
      files: [
        {
          name: `main.${getFileExtension(language)}`,
          content: code,
        },
      ],
    });

    const { stdout, stderr } = res.data.run;

    if (stderr && stderr.trim().length > 0) {
      return {
        success: false,
        error: stderr,
        output: stdout,
      };
    }

    return {
      success: true,
      output: stdout || "",
    };
  } catch (error) {
    return {
      success: false,
      error:
        error.response?.data?.message ||
        error.message ||
        "Error while executing code",
    };
  }
};
