document.addEventListener("DOMContentLoaded", function () {
  const textInput = document.getElementById("textInput");
  const submitBtn = document.getElementById("submitBtn");
  const modalOverlay = document.getElementById("modalOverlay");
  const downloadBtn = document.getElementById("downloadBtn");
  const openBtn = document.getElementById("openBtn");
  const closeModalBtn = document.getElementById("closeModal");

  let convertedHTML = "";

  textInput.addEventListener("keydown", function (e) {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      processText();
    }
  });

  submitBtn.addEventListener("click", processText);

  function processText() {
    const text = textInput.value.trim();

    if (!text) {
      alert("bro type smth");
      return;
    }

    const markdownHtml = marked.parse(text);

    convertedHTML = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>readwho? doc</title>
            <style>
                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
                    line-height: 1.6;
                    color: #24292e;
                    background-color: white;
                    margin: 0 auto;
                    max-width: 800px;
                    padding: 45px;
                }
                h1, h2, h3, h4, h5, h6 {
                    margin-top: 24px;
                    margin-bottom: 16px;
                    font-weight: 600;
                    line-height: 1.25;
                }
                h1 {
                    font-size: 2em;
                    border-bottom: 1px solid #eaecef;
                    padding-bottom: 0.3em;
                }
                h2 {
                    font-size: 1.5em;
                    border-bottom: 1px solid #eaecef;
                    padding-bottom: 0.3em;
                }
                p {
                    margin-top: 0;
                    margin-bottom: 16px;
                }
                a {
                    color: #0366d6;
                    text-decoration: none;
                }
                a:hover {
                    text-decoration: underline;
                }
                code {
                    font-family: SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace;
                    padding: 0.2em 0.4em;
                    margin: 0;
                    font-size: 85%;
                    background-color: rgba(27,31,35,0.05);
                    border-radius: 3px;
                }
                pre {
                    background-color: #f6f8fa;
                    border-radius: 3px;
                    padding: 16px;
                    overflow: auto;
                }
                pre code {
                    background-color: transparent;
                    padding: 0;
                }
                blockquote {
                    margin: 0 0 16px;
                    padding: 0 1em;
                    color: #6a737d;
                    border-left: 0.25em solid #dfe2e5;
                }
                ul, ol {
                    padding-left: 2em;
                    margin-bottom: 16px;
                }
            </style>
        </head>
        <body class="markdown-body">
            ${markdownHtml}
        </body>
        </html>
        `;

    modalOverlay.style.display = "flex";
  }

  downloadBtn.addEventListener("click", function () {
    const blob = new Blob([convertedHTML], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "readwho.html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    modalOverlay.style.display = "none";
  });

  openBtn.addEventListener("click", function () {
    const blob = new Blob([convertedHTML], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
    modalOverlay.style.display = "none";
  });

  closeModalBtn.addEventListener("click", function () {
    modalOverlay.style.display = "none";
  });

  modalOverlay.addEventListener("click", function (e) {
    if (e.target === modalOverlay) {
      modalOverlay.style.display = "none";
    }
  });
});
