export default function agreeMenu(text, onAgree) {
  const backdrop = document.createElement("div");
  backdrop.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
  `;

  const menuContainer = document.createElement("div");
  menuContainer.style.cssText = `
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    width: 300px;
    max-width: 90%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    font-size: 16px;
    font-weight: 400;
  `;

  const textContainer = document.createElement("div");
  textContainer.style.cssText = `
    padding: 20px;
    text-align: center;
    flex-grow: 1;
  `;
  textContainer.textContent = text;

  const buttonContainer = document.createElement("div");
  buttonContainer.style.cssText = `
    display: flex;
    border-top: 1px solid #eee;
  `;

  const cancelButton = document.createElement("button");
  cancelButton.style.cssText = `
    flex: 1;
    padding: 12px 0;
    background: transparent;
    border: none;
    border-right: 1px solid #eee;
    cursor: pointer;
    font-size: 16px;
    font-weight: 400;
    color: #333;
  `;
  cancelButton.textContent = "Отмена";
  cancelButton.addEventListener("click", () => {
    document.body.removeChild(backdrop);
  });

  const agreeButton = document.createElement("button");
  agreeButton.style.cssText = `
    flex: 1;
    padding: 12px 0;
    background: transparent;
    border: none;
    cursor: pointer;
    font-size: 16px;
    font-weight: 400;
    color: #333;
  `;
  agreeButton.textContent = "Ок";
  agreeButton.addEventListener("click", () => {
    document.body.removeChild(backdrop);
    if (typeof onAgree === "function") {
      onAgree();
    }
  });

  buttonContainer.appendChild(cancelButton);
  buttonContainer.appendChild(agreeButton);

  menuContainer.appendChild(textContainer);
  menuContainer.appendChild(buttonContainer);

  backdrop.appendChild(menuContainer);

  document.body.appendChild(backdrop);
}
