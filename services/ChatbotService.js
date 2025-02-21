const { spawn } = require("child_process");

function sendMessageToModel(message, execTimeoutMs = 120000) {
  return new Promise((resolve, reject) => {
    // Spawn an Ollama process to run 'deepseek-r1' each time
    const modelProcess = spawn("ollama", ["run", "deepseek-r1"], {
      stdio: ["pipe", "pipe", "pipe"],
    });

    let messageBuffer = "";
    let timedOut = false;

    // Automatically kill the process if it exceeds `execTimeoutMs`
    const killTimer = setTimeout(() => {
      timedOut = true;
      modelProcess.kill("SIGKILL"); // Force-kill the process
      reject(new Error(`Model timed out after ${execTimeoutMs} ms.`));
    }, execTimeoutMs);

    // Collect output from STDOUT
    modelProcess.stdout.on("data", (data) => {
      messageBuffer += data.toString();
    });

    // (Optional) read STDERR for logging
    modelProcess.stderr.on("data", (data) => {
      const str = data.toString();
      // If you want to log or strip ANSI codes, do so here
    });

    // When the process exits, resolve or reject
    modelProcess.on("exit", (code) => {
      clearTimeout(killTimer);
      if (!timedOut) {
        console.log(`Model process exited with code ${code}`);
        if (messageBuffer.trim().length > 0) {
          resolve(messageBuffer);
        } else {
          reject(new Error("Model did not return any output."));
        }
      }
    });

    // Send the user's input to the model
    modelProcess.stdin.write(`${message}\n`);
    modelProcess.stdin.end();
  });
}

module.exports = {
  sendMessageToModel,
};
