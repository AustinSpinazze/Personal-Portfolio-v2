import TypeWriter from './TypeWriter.js';
import { JAVASCRIPT, TYPESCRIPT, GOLANG, JAVA } from '../../utils/constants.js';

let typewriter;

const template = document.createElement("template");
template.innerHTML = /*html*/`
<style>
	.editor {
		width: 100%;
		border-radius: 2px;
		background-color: var(--white);
		box-shadow: inset 0 0 0 3px var(--black);
		margin-bottom: 1.6rem;
	}

	.editor-buttons {
		padding: 10px;
		background-color: var(--black);
		box-shadow: inset 0 0 0 3px var(--black);
	}

	.editor-button {
		display: inline-block;
		width: 10px;
		height: 10px;
		border-radius: 100%;
	}

	.editor-button:nth-child(1) {
		background: var(--red);
	}

	.editor-button:nth-child(2) {
		background: var(--yellow);
	}

	.editor-button:nth-child(3) {
		background: var(--green);
	}

	.editor-content {
		display: flex;
		line-height: 1.5;
		letter-spacing: normal;
		padding-bottom: 3.2rem;
	}

	.line-numbers {
		display: flex;
		flex-direction: column;
		padding: 10px 0 0 15px;
		margin-right: 10px;
		font-size: 1.6rem;
		font-weight: 700;
		color: var(--dark-gray);
	}

	.editor-text {
		width: 100%;
		padding: 10px 10px 0 0;
		white-space: pre-wrap;
		font-size: 1.6rem;
		font-weight: 700;
		color: var(--dark-gray);
	}

	.editor-footer-buttons {
		display: grid;
		grid-auto-columns: minmax(0, 1fr);
		grid-auto-flow: column;
		gap: 0.8rem;
	}

  .btn {
	  width: 100%;
	  padding: 1.2rem 0;
	  border: none;
	  border-radius: 5.5px;
	  text-decoration: none;
	  font-weight: 500;
	  font-size: 1.8rem;
  }

  .disabled {
	  cursor: none;
  }

	.javascript {
		color: var(--js-yellow);
		background-color: var(--white);
		box-shadow: inset 0 0 0 3px var(--js-yellow),
			4.11px 4.11px 0 0 rgba(0, 0, 0, 0.25);
		cursor: pointer;
		transition: color 0.3s;
	}

	.javascript:hover,
	.javascript:focus {
		animation: halftone 0.5s forwards;
		background: radial-gradient(
					circle,
					var(--js-yellow) 0.2em,
					transparent 0.25em
				)
				0 0 / 1.25em 1.25em,
			radial-gradient(circle, var(--js-yellow) 0.2em, transparent 0.25em)
				6.25em 6.25em / 1.25em 1.25em;
		color: var(--white);
	}

	@keyframes halftone {
		100% {
			background-size: 2.375em 2.375em, 0.1em 0.1em;
		}
	}

	.typescript {
		color: var(--ts-blue);
		background-size: 100% 200%;
		background-image: linear-gradient(
			to bottom,
			var(--white) 50%,
			var(--ts-blue) 50%
		);
		box-shadow: inset 0 0 0 3px var(--ts-blue),
			4.11px 4.11px 0 0 rgba(0, 0, 0, 0.25);
		cursor: pointer;
		transition: background-position 0.3s;
	}

	.typescript:hover,
	.typescript:focus {
		background-position: 0 -100%;
		color: white;
	}

	.golang {
		color: var(--go-turq);
		background-color: var(--white);
		box-shadow: inset 0 0 0 3px var(--go-turq),
			4.11px 4.11px 0 0 rgba(0, 0, 0, 0.25);
		cursor: pointer;
	}

	.golang:hover,
	.golang:focus {
		animation: stripes-move 0.75s infinite linear;
		background: repeating-linear-gradient(
			45deg,
			var(--go-light) 0,
			var(--go-light) 0.25em,
			transparent 0.25em,
			transparent 0.5em
		);
		color: var(--go-turq);
	}

	@keyframes stripes-move {
		100% {
			background-position: 5em 0px;
		}
	}

	.java {
		color: var(--java-orange);
		background: none;
		box-shadow: inset 0 0 0 3px var(--java-orange),
			4.11px 4.11px 0 0 rgba(0, 0, 0, 0.25);
		cursor: pointer;
		position: relative;
		transition: color 0.3s ease-in-out;
	}

	.java:before {
		content: '';
		position: absolute;
		z-index: -1;
		border-radius: 5px;
	}

	.java:hover,
	.java:focus {
		color: #fff;
	}

	.java:before {
		height: 0;
		left: 50%;
		top: 50%;
		width: 0;
		background: var(--java-orange);
		transition: width, height, top, left, 0.3s ease-in-out;
	}

	.java:hover:before,
	.java:focus:before {
		height: 100%;
		left: 0;
		top: 0;
		width: 100%;
	}
</style>
<div class="editor">
	<div class="editor-buttons">
		<div class="editor-button"></div>
		<div class="editor-button"></div>
		<div class="editor-button"></div>
	</div>
	<div class="editor-content">
		<div class="line-numbers">
			<div class="line-number">1</div>
			<div class="line-number">2</div>
			<div class="line-number">3</div>
			<div class="line-number">4</div>
			<div class="line-number">5</div>
			<div class="line-number">6</div>
			<div class="line-number">7</div>
			<div class="line-number">8</div>
			<div class="line-number">9</div>
			<div class="line-number">10</div>
			<div class="line-number">11</div>
			<div class="line-number">12</div>
			<div class="line-number">13</div>
		</div>
		<div class="editor-text"></div>
	</div>
</div>
<div class="editor-footer">
	<div class="editor-footer-buttons">
		<button
			id="lang-button"
			class="btn javascript"
			onclick="this.getRootNode().host.writeJavaScript()"
		>
			JavaScript
		</button>
		<button
			id="lang-button"
			class="btn typescript"
			onclick="this.getRootNode().host.writeTypeScript()"
		>
			TypeScript
		</button>
		<button
			id="lang-button"
			class="btn golang"
			onclick="this.getRootNode().host.writeGolang()"
		>
			Go
		</button>
		<button
			id="lang-button"
			class="btn java"
			onclick="this.getRootNode().host.writeJava()"
		>
			Java
		</button>
	</div>
</div>
`;

export default class HeroEditor extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    typewriter = new TypeWriter(
      this.shadowRoot.querySelector('.editor-text'),
      {
        loop: false,
        typingSpeed: 20,
        deletingSpeed: 10,
      }
    );
    this.writeJavaScript();
  }

  async writeJavaScript() {
    this.disableButton(false);
    await typewriter.deleteAll().typeString(JAVASCRIPT).start();
    this.disableButton(true);
  }

  async writeTypeScript() {
    this.disableButton(false);
    await typewriter.deleteAll().typeString(TYPESCRIPT).start();
    this.disableButton(true);
  }

  async writeGolang() {
    this.disableButton(false);
    await typewriter.deleteAll().typeString(GOLANG).start();
    this.disableButton(true);
  }

  async writeJava() {
    this.disableButton(false);
    await typewriter.deleteAll().typeString(JAVA).start();
    this.disableButton(true);
  }

  disableButton(state) {
    let elements = this.shadowRoot.querySelectorAll('#lang-button');
    elements.forEach((button) => {
      console.log(button, state);
      if (state) {
        button.removeAttribute("disabled", "");
        button.setAttribute("enabled", "");
      } else {
        button.removeAttribute("enabled", "");
        button.setAttribute("disabled", "");
      }
    });
  }
}

customElements.define("hero-editor", HeroEditor);
