import { IInputs, IOutputs } from "./generated/ManifestTypes";
// @ts-ignore
import * as twitter from "twitter-widgets";

export class TwitterControl implements ComponentFramework.StandardControl<IInputs, IOutputs> {


	private _container: HTMLDivElement;
	private _context: ComponentFramework.Context<IInputs>;
	private _notifyOutputChanged: () => void;
	private _textElement: HTMLInputElement;
	private _textElementChanged: EventListenerOrEventListenerObject;
	private _anchorElement: HTMLAnchorElement;
	private _scriptElement: HTMLScriptElement;


	private _value: string;

	/**
	 * Empty constructor.
	 */
	constructor() {

	}

	/**
	 * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
	 * Data-set values are not initialized here, use updateView.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
	 * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
	 * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
	 * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
	 */
	public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container: HTMLDivElement) {
		// Add control initialization code
		this._context = context;
		this._container = container;
		this._notifyOutputChanged = notifyOutputChanged;
		this._textElementChanged = this.twitterNameChanged.bind(this);

		this._value = "";

		if (context.parameters.twitterUsernameProperty == null) {
			this._value = "";
		}
		else {
			this._value = context.parameters.twitterUsernameProperty.raw == null ? "" : context.parameters.twitterUsernameProperty.raw;
		}

		this.AddControls();


	}


	/**
	 * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
	 */
	public updateView(context: ComponentFramework.Context<IInputs>): void {
		// Add code to update control view



	}

	/** 
	 * It is called by the framework prior to a control receiving new data. 
	 * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
	 */
	public getOutputs(): IOutputs {
		return {
			twitterUsernameProperty: this._value
		};
	}

	/** 
	 * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
	 * i.e. cancelling any pending remote calls, removing listeners, etc.
	 */
	public destroy(): void {
		// Add code to cleanup control if necessary
		this._textElement.removeEventListener("change", this._textElementChanged);
	}

	public twitterNameChanged(evt: Event): void {
		this._value = this._textElement.value;

		// clear the div and add the controls again

		// this._container.innerHTML = "";
		while (this._container.firstChild)
			this._container.removeChild(this._container.firstChild);

		// adding the control back

		this.AddControls();

		this._notifyOutputChanged();

	}

	private AddControls() {

		this._textElement = document.createElement("input");
		this._textElement.setAttribute("type", "text");
		this._textElement.addEventListener("change", this._textElementChanged);
		this._textElement.setAttribute("value", this._value);
		this._textElement.setAttribute("class", "InputText");
		this._textElement.value = this._value;
		this._textElement.addEventListener("focusin", () => {
			this._textElement.className = "InputTextFocused";
		});
		this._textElement.addEventListener("focusout", () => {
			this._textElement.className = "InputText";
		});
		this._anchorElement = document.createElement("a");
		this._anchorElement.setAttribute("href", "https://twitter.com/" + this._value);
		this._anchorElement.setAttribute("class", "twitter-timeline");
		this._anchorElement.setAttribute("data-width", "400");
		this._anchorElement.setAttribute("data-height", "500");
		this._scriptElement = document.createElement("script");
		this._scriptElement.setAttribute("src", "https://platform.twitter.com/widgets.js");
		this._scriptElement.setAttribute("charset", "utf-8");
		this._scriptElement.async = true;
		this._container.appendChild(this._scriptElement);
		this._container.appendChild(this._textElement);
		this._container.appendChild(this._anchorElement);
	}
}

