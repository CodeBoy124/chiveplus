import {AreaReadStatus} from "../enums.js";

export function processComments(areas, supportData){
	for(let areaId = 0; areaId < areas.length; areaId++){
		if(areas[areaId].type != AreaReadStatus.Comment.Single && areas[areaId].type != AreaReadStatus.Comment.Multi) continue;
		let isSingle = areas[areaId].type == AreaReadStatus.Comment.Single;
		let output = {
			type: AreaReadStatus.Out,
			content: "",
			line: areas[areaId].line
		};
		if(isSingle){
			output.content = supportData.comment.single(areas[areaId].content);
		}else{
			output.content = supportData.comment.multi(areas[areaId].content);
		}
		areas[areaId] = output;
	}
	return areas;
}
