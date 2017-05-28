import {IDevice} from "./IDevice";

export class IotDevice implements IDevice{
        public id: string;
        public name: string;    
        public value: string;    
        public lastedit: Date;
           
}
