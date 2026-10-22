import {z,OperationRejectedError} from '@dsh-workbench/runtime';
import {editableBoostSchema,type PipelineCard} from './contracts';
export const cardFieldsSchema=z.object({name:z.string(),description:z.string(),attack:z.string(),health:z.string(),artBrief:z.string(),boost:z.string()});
export type CardFields=z.output<typeof cardFieldsSchema>;
export function cardBoostEffect(card:PipelineCard){
 const effect=card.definition.kind==='talisman'&&card.definition.effects?.length===1?card.definition.effects[0]:undefined;
 const parsed=editableBoostSchema.safeParse(effect);return parsed.success?parsed.data:undefined;
}
export function cardEditorValue(card:PipelineCard):CardFields{
 const effect=cardBoostEffect(card);
 return {name:card.definition.name,description:card.definition.description??'',attack:String(card.definition.attack??''),health:String(card.definition.health??''),artBrief:card.artBrief,boost:String(effect?effect.actions[0]!.value:'')};
}
export function cardDefinition(card:PipelineCard,value:CardFields){
 const {name,description,attack,health,boost}=value;
 if(!name.trim()||!description.trim())throw new OperationRejectedError('名称和说明不能为空');
 const unit=card.definition.kind==='unit',effect=cardBoostEffect(card);
 if(unit&&(!Number.isInteger(Number(attack))||!Number.isInteger(Number(health))||Number(attack)<0||Number(health)<1||Number(attack)>999||Number(health)>999))throw new OperationRejectedError('攻防需要有效整数');
 if(effect&&(!Number.isInteger(Number(boost))||Number(boost)<1||Number(boost)>9))throw new OperationRejectedError('攻击增益需要 1–9 的整数');
 const rule=effect?`使一个带有「${effect.target.requiredLabelsAllOf[0]}」标签的己方单位本回合攻击 +${Number(boost)}。`:undefined;
 const boostPatch=effect?{description:rule,effects:[{...effect,text:rule,actions:[{...effect.actions[0],value:Number(boost)}]}]}:{};
 return {...card.definition,name,description,...(unit?{attack:Number(attack),health:Number(health)}:{}),...boostPatch};
}
