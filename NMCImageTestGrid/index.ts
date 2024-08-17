import { createReadStream } from "fs";
import {IInputs, IOutputs} from "./generated/ManifestTypes";
import DataSetInterfaces = ComponentFramework.PropertyHelper.DataSetApi;
type DataSet = ComponentFramework.PropertyTypes.DataSet;


const LoadMoreButton_Hidden_Style = "LoadMoreButton_Hidden_Style";




export class NMCImageTestGrid implements ComponentFramework.StandardControl<IInputs, IOutputs> {

	/**
	 * Empty constructor.
	 */

	private contextObj: ComponentFramework.Context<IInputs>;
		

	// Div element created as part of this control's main container
	private mainContainer: HTMLDivElement;

	// Table element created as part of this control's table


	private loadPageButton: HTMLButtonElement;

	

	constructor()
	{

	}

	/**
	 * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
	 * Data-set values are not initialized here, use updateView.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
	 * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
	 * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
	 * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
	 */
	public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container:HTMLDivElement)
	{
		context.mode.trackContainerResize(true);

			// Create main table container div. 
			this.mainContainer = document.createElement("div");
			this.mainContainer.classList.add("row");

			// Create data table container div. 
            
		
			
			// Create data table container div. 
			this.loadPageButton = document.createElement("button");
			this.loadPageButton.setAttribute("type", "button");
			this.loadPageButton.innerText = context.resources.getString("PCF_TSTableGrid_LoadMore_B-uttonLabel");
			this.loadPageButton.classList.add(LoadMoreButton_Hidden_Style);
			this.loadPageButton.classList.add("LoadMoreButton_Style");
			this.loadPageButton.addEventListener("click", this.onLoadMoreButtonClick.bind(this));
		

			this.mainContainer.appendChild(this.loadPageButton);
			// Adding the main table and loadNextPage button created to the container DIV.
			container.appendChild(this.mainContainer);

	}


	/**
	 * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
	 */
	public updateView(context: ComponentFramework.Context<IInputs>): void
	{
		this.contextObj = context;
		while(this.mainContainer.firstChild)
		{
			this.mainContainer.removeChild(this.mainContainer.firstChild);
		}
	    if(!context.parameters.sampleDataSet.loading)
		{

			

			this.createCardList(context.parameters.sampleDataSet,"crf08_photo");
		}
	}



	private createCardList(gridParam: DataSet,entityName : any) : void
	{
			 
		if(gridParam.sortedRecordIds.length > 0)
		{
			for(let currentRecordId of gridParam.sortedRecordIds)
			{
				let column: HTMLDivElement   = document.createElement("div");
	
				column.classList.add("column");
					
				let card: HTMLDivElement   = document.createElement("div");
				card.classList.add("card");
				//let aHerf  = document.createElement("a");
				//aHerf.setAttribute('href', '/main.aspx?appid=4f99705e-a9d0-4167-837f-af7dbf400823&pagetype=entityrecord&etn=crf08_inspectionphoto&id='+currentRecordId);  
				let img = document.createElement('img');  
				var timeStampInMs = Date.now();
				let url ='/Image/download.aspx?Entity=crf08_inspectionphoto&Attribute='+entityName+'&Id='+currentRecordId+'&Timestamp='+timeStampInMs;
				
			 	img.addEventListener("click",this.onRowClick.bind(this));
				img.setAttribute('rowID', currentRecordId);  
				img.setAttribute('src', url);  
				img.setAttribute('style', "width:100%;");
				//aHerf.appendChild(img);
				card.appendChild(img);
				column.appendChild(card);
				this.mainContainer.append(column);
			}
		}
	 
		
		
	}

	private onRowClick(event: Event): void
	{
		let imgElement = (event.currentTarget as HTMLTableRowElement);
	
		let rowRecordId = imgElement.getAttribute("rowID");
		if (rowRecordId) {
				const record = this.contextObj.parameters.sampleDataSet.records[rowRecordId];
				this.contextObj.parameters.sampleDataSet.openDatasetItem(record.getNamedReference());

		}
	}


/** 
	 * It is called by the framework prior to a control receiving new data. 
	 * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
	 */
	public getOutputs(): IOutputs
	{
		return {};
	}

	/** 
	 * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
	 * i.e. cancelling any pending remote calls, removing listeners, etc.
	 */
	public destroy(): void
	{
		// Add code to cleanup control if necessary
	}


	private onLoadMoreButtonClick(event: Event): void {
		this.contextObj.parameters.sampleDataSet.paging.loadNextPage();
		this.toggleLoadMoreButtonWhenNeeded(this.contextObj.parameters.sampleDataSet);
	}

	private toggleLoadMoreButtonWhenNeeded(gridParam: DataSet): void{
			
		if(gridParam.paging.hasNextPage && this.loadPageButton.classList.contains(LoadMoreButton_Hidden_Style))
		{
			this.loadPageButton.classList.remove(LoadMoreButton_Hidden_Style);
		}
		else if(!gridParam.paging.hasNextPage && !this.loadPageButton.classList.contains(LoadMoreButton_Hidden_Style))
		{
			this.loadPageButton.classList.add(LoadMoreButton_Hidden_Style);
		}

	}

}