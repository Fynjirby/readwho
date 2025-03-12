document.addEventListener("DOMContentLoaded", function () {
  const textInput = document.getElementById("textInput");
  const submitBtn = document.getElementById("submitBtn");
  const modalOverlay = document.getElementById("modalOverlay");
  const downloadBtn = document.getElementById("downloadBtn");
  const openBtn = document.getElementById("openBtn");
  const closeModalBtn = document.getElementById("closeModal");

  let convertedHTML = "";

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modalOverlay.style.display === "flex") {
      modalOverlay.style.display = "none";
    }

    if (modalOverlay.style.display === "flex") {
      if (e.key === "Enter" && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        openBtn.click();
      }
    }
  });

  textInput.addEventListener("keydown", function (e) {
    if (e.key === "Tab") {
      e.preventDefault();
      const start = this.selectionStart;
      this.value =
        this.value.substring(0, start) +
        "    " +
        this.value.substring(this.selectionEnd);
      this.selectionStart = this.selectionEnd = start + 4;
    }

    if (e.altKey && (e.key === "ArrowUp" || e.key === "ArrowDown")) {
      e.preventDefault();
      const text = this.value;
      const lines = text.split("\n");
      const currentPos = this.selectionStart;
      let lineStart = text.lastIndexOf("\n", currentPos - 1) + 1;
      if (lineStart === -1) lineStart = 0;
      let lineEnd = text.indexOf("\n", currentPos);
      if (lineEnd === -1) lineEnd = text.length;
      const lineIndex = text.substring(0, lineStart).split("\n").length - 1;

      if (
        (lineIndex === 0 && e.key === "ArrowUp") ||
        (lineIndex === lines.length - 1 && e.key === "ArrowDown")
      ) {
        return;
      }

      const currentLine = lines[lineIndex];
      if (e.key === "ArrowUp") {
        lines[lineIndex] = lines[lineIndex - 1];
        lines[lineIndex - 1] = currentLine;
      } else {
        lines[lineIndex] = lines[lineIndex + 1];
        lines[lineIndex + 1] = currentLine;
      }

      const newText = lines.join("\n");
      this.value = newText;
      const newLineStart = newText.indexOf(
        currentLine,
        e.key === "ArrowUp"
          ? newText.lastIndexOf("\n", lineStart - 2) + 1
          : lineStart,
      );
      this.selectionStart = this.selectionEnd =
        newLineStart + (currentPos - lineStart);
    }

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

    let html = marked.parse(text);
    html = html.replace(
      /<pre><code( class="language-([^"]*)")?>([^<]+)<\/code><\/pre>/g,
      function (match, langClass, lang, code) {
        const langAttr = lang ? ` class="language-${lang}"` : "";
        return `<div class="code-block">
          <pre><code${langAttr}>${code}</code></pre>
          <button class="copy-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          </button>
        </div>`;
      },
    );

    convertedHTML = `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; img-src 'self' data:;">
      <title>readwho? doc</title>
      <link href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.24.1/themes/prism.min.css" rel="stylesheet" />
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
        margin-bottom: 0;
        margin: 0;
      }
      pre code {
        background-color: transparent;
        padding: 0;
        font-size: 100%;
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
      .code-block {
        position: relative;
        margin-bottom: 16px;
        border-radius: 6px;
        overflow: hidden;
        box-shadow: 0 1px 2px rgba(0,0,0,0.1);
      }
      .copy-btn {
        position: absolute;
        top: 5px;
        right: 5px;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(255, 255, 255, 0.7);
        border: 1px solid #ddd;
        border-radius: 4px;
        cursor: pointer;
        color: #24292e;
        transition: all 0.2s;
        z-index: 10;
      }
      .copy-btn:hover {
        background: rgba(255, 255, 255, 0.9);
      }
      .copy-btn svg {
        width: 16px;
        height: 16px;
      }
      code[class*="language-"],
      pre[class*="language-"] {
        font-family: SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace;
        font-size: 14px;
        margin: 0;
      }
      </style>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.24.1/components/prism-core.min.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.24.1/plugins/autoloader/prism-autoloader.min.js"></script>
      <script>
      document.addEventListener('DOMContentLoaded', function() {
        document.querySelectorAll('.copy-btn').forEach(button => {
          button.addEventListener('click', function() {
            const codeBlock = this.closest('.code-block');
            const codeText = codeBlock.querySelector('code').textContent;
            navigator.clipboard.writeText(codeText).then(() => {
              const originalHTML = this.innerHTML;
              this.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
              setTimeout(() => {
                this.innerHTML = originalHTML;
              }, 2000);
            });
          });
        });
        if (typeof Prism !== 'undefined') {
          Prism.highlightAll();
        }
        document.querySelectorAll('a[href]').forEach(link => {
          if (link.hostname !== window.location.hostname) {
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
          }
        });
      });
      </script>
    </head>
    <body class="markdown-body">
      ${html}
    </body>
    </html>`;

    modalOverlay.style.display = "flex";
  }

  downloadBtn.addEventListener("click", function () {
    if (modalOverlay.style.display != "flex") {
      return;
    }

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
