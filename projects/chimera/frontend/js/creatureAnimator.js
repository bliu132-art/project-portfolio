// Low-frame-rate virtual-pet actions. Every pose lands on integer pixels.
const CREATURE_ANIMATION_STATES=Object.freeze({REST:"REST",IDLE:"REST",BLINK:"BLINK",LOOK_AROUND:"LOOK_AROUND",WADDLE:"WADDLE",BOUNCE:"BOUNCE",HAPPY:"HAPPY",DOZE:"DOZE",CALL_PLAYER:"CALL_PLAYER",WALK_LEFT:"WALK_LEFT",WALK_RIGHT:"WALK_RIGHT",BUMP_LEFT:"BUMP_LEFT",BUMP_RIGHT:"BUMP_RIGHT",CORNER_PEEK:"CORNER_PEEK",EAR_CHECK:"EAR_CHECK",TINY_TURN:"TINY_TURN",LOOK_BEHIND:"LOOK_BEHIND",TRIP_RECOVER:"TRIP_RECOVER",SELF_SQUISH:"SELF_SQUISH",CHEEK_PUFF:"CHEEK_PUFF",HICCUP:"HICCUP",SNEEZE:"SNEEZE",ACCESSORY_PLAY:"ACCESSORY_PLAY",CHASE_SPARK:"CHASE_SPARK",SIT_DOZE:"SIT_DOZE",MIRROR_PLAYER:"MIRROR_PLAYER",SQUINT:"SQUINT",MOUTH_OPEN:"MOUTH_OPEN"});

const ACTION_DEFINITIONS=Object.freeze([
    {name:"BLINK",day:1,weight:22,duration:.25},
    {name:"LOOK_AROUND",day:1,weight:10,duration:1.1},
    {name:"SELF_SQUISH",day:2,weight:7,duration:.8},
    {name:"HICCUP",day:2,weight:3,duration:.65},
    {name:"WADDLE",day:3,weight:9,duration:1},
    {name:"BOUNCE",day:3,weight:7,duration:.85},
    {name:"CHEEK_PUFF",day:3,weight:5,duration:1},
    {name:"HAPPY",day:3,weight:5,duration:1.1},
    {name:"WALK_LEFT",day:4,weight:5,duration:1.2},
    {name:"WALK_RIGHT",day:4,weight:5,duration:1.2},
    {name:"EAR_CHECK",day:4,weight:4,duration:1.1},
    {name:"TINY_TURN",day:4,weight:3,duration:.9},
    {name:"LOOK_BEHIND",day:4,weight:3,duration:1},
    {name:"BUMP_LEFT",day:5,weight:3,duration:1.45},
    {name:"BUMP_RIGHT",day:5,weight:3,duration:1.45},
    {name:"CORNER_PEEK",day:5,weight:2,duration:1.8},
    {name:"CHASE_SPARK",day:5,weight:3,duration:1.7},
    {name:"TRIP_RECOVER",day:6,weight:1,duration:1.2},
    {name:"SNEEZE",day:6,weight:2,duration:1},
    {name:"DOZE",day:6,weight:3,duration:1.4},
    {name:"SIT_DOZE",day:6,weight:3,duration:1.8},
    {name:"CALL_PLAYER",day:7,weight:3,duration:1.4},
    {name:"ACCESSORY_PLAY",day:7,weight:3,duration:1.25},
    {name:"MIRROR_PLAYER",day:7,weight:2,duration:1.2}
]);

function randomIdleDelay(){return 1.2+Math.random()*2.6;}
function createCreatureAnimationState(){return{fsm:"REST",stateTime:0,stateDuration:0,nextActionIn:randomIdleDelay(),elapsed:0,positionX:0,positionY:0,startX:0,targetX:0,bodyBob:0,headBob:0,earOffset:0,tailPhase:0,eyeState:"OPEN",mouthOpen:false,silhouettePose:"neutral",gazeX:0,cheekPuff:false,turned:false,accessoryPulse:false,sparkVisible:false,sparkX:3,sparkY:8};}
function resetTransient(s){s.bodyBob=0;s.headBob=0;s.earOffset=0;s.eyeState="OPEN";s.mouthOpen=false;s.silhouettePose="neutral";s.gazeX=0;s.cheekPuff=false;s.turned=false;s.accessoryPulse=false;s.sparkVisible=false;}
function profileScoreForAnimation(context,key){return context?.personalityProfile?.[key]?.score??.5;}
function weightedActions(day,context){return ACTION_DEFINITIONS.filter(function(a){return day>=a.day;}).map(function(a){let weight=a.weight;if(["LOOK_AROUND","CHASE_SPARK","LOOK_BEHIND"].includes(a.name))weight*=.6+profileScoreForAnimation(context,"curiosity");if(["BOUNCE","BUMP_LEFT","BUMP_RIGHT","TRIP_RECOVER"].includes(a.name))weight*=.6+profileScoreForAnimation(context,"riskTaking");if(["CALL_PLAYER","HAPPY","CHEEK_PUFF"].includes(a.name))weight*=.6+profileScoreForAnimation(context,"sociability");if(["DOZE","SIT_DOZE"].includes(a.name))weight*=.6+profileScoreForAnimation(context,"empathy");return{...a,weight};});}
function chooseAction(day,context){const actions=weightedActions(day,context),total=actions.reduce(function(sum,a){return sum+a.weight;},0);let roll=Math.random()*total;for(const action of actions){roll-=action.weight;if(roll<=0)return action;}return actions[0];}
function enterAction(s,action){s.fsm=action.name;s.stateTime=0;s.stateDuration=action.duration;s.startX=s.positionX||0;s.targetX=s.startX;if(action.name==="WALK_LEFT")s.targetX=Math.max(-4,s.startX-3);if(action.name==="WALK_RIGHT")s.targetX=Math.min(4,s.startX+3);resetTransient(s);}
function finishAction(s){if(s.fsm==="WALK_LEFT"||s.fsm==="WALK_RIGHT")s.positionX=s.targetX;if(s.fsm==="CALL_PLAYER")s.positionX=0;s.fsm="REST";s.stateTime=0;s.stateDuration=0;s.nextActionIn=randomIdleDelay();resetTransient(s);}
function steppedLerp(a,b,t,steps=4){return Math.round(a+(b-a)*(Math.floor(Math.min(.999,t)*steps)/(steps-1)));}

function applyActionPose(s,t){
    const phase=Math.floor(t*6);
    if(s.fsm==="BLINK")s.eyeState=t<.78?"CLOSED":"OPEN";
    else if(s.fsm==="LOOK_AROUND")s.gazeX=t<.34?-1:(t<.68?1:0);
    else if(s.fsm==="SELF_SQUISH")s.silhouettePose=t<.75?"squash":"neutral";
    else if(s.fsm==="HICCUP"){s.positionY=t<.28?-1:0;s.mouthOpen=t<.45;}
    else if(s.fsm==="WADDLE")s.silhouettePose=phase%2?"left":"right";
    else if(s.fsm==="BOUNCE")s.silhouettePose=t<.2?"squash":(t<.7?"jump":"squash");
    else if(s.fsm==="CHEEK_PUFF"){s.cheekPuff=true;s.mouthOpen=false;}
    else if(s.fsm==="HAPPY"){s.eyeState="SQUINT";s.mouthOpen=true;s.silhouettePose=phase%2?"jump":"squash";}
    else if(s.fsm==="WALK_LEFT"||s.fsm==="WALK_RIGHT"){s.positionX=steppedLerp(s.startX,s.targetX,t);s.silhouettePose=phase%2?"left":"right";}
    else if(s.fsm==="EAR_CHECK"){s.gazeX=t<.7?-1:0;s.earOffset=t<.7?1:0;s.silhouettePose=t<.7?"left":"neutral";}
    else if(s.fsm==="TINY_TURN"){s.turned=t>.2&&t<.8;s.eyeState=s.turned?"CLOSED":"OPEN";}
    else if(s.fsm==="LOOK_BEHIND"){s.gazeX=t<.3?1:0;s.turned=t>.3&&t<.8;}
    else if(s.fsm==="BUMP_LEFT"||s.fsm==="BUMP_RIGHT"){
        const dir=s.fsm==="BUMP_LEFT"?-1:1,edge=dir*5;
        s.positionX=t<.55?steppedLerp(s.startX,edge,t/.55):steppedLerp(edge,dir*4,(t-.55)/.45);
        if(t>.45&&t<.7){s.silhouettePose="squash";s.eyeState="CLOSED";}
    }else if(s.fsm==="CORNER_PEEK"){
        const dir=s.startX>0?1:-1,target=dir*5;s.positionX=t<.35?steppedLerp(s.startX,target,t/.35):(t<.75?target:steppedLerp(target,0,(t-.75)/.25));s.gazeX=-dir;
    }else if(s.fsm==="CHASE_SPARK"){
        const dir=s.startX<=0?1:-1;s.sparkVisible=true;s.sparkX=12+dir*(3+Math.floor(t*3));s.sparkY=7+(phase%2);s.gazeX=dir;s.positionX=steppedLerp(s.startX,dir*3,t);
    }else if(s.fsm==="TRIP_RECOVER"){
        if(t<.25)s.silhouettePose="left";else if(t<.7){s.silhouettePose="squash";s.positionY=1;s.eyeState="CLOSED";}else{s.eyeState="SQUINT";s.positionY=0;}
    }else if(s.fsm==="SNEEZE"){
        if(t<.45){s.eyeState="SQUINT";s.silhouettePose="squash";}else if(t<.7){s.eyeState="CLOSED";s.mouthOpen=true;s.silhouettePose="left";}else s.eyeState="SQUINT";
    }else if(s.fsm==="DOZE"||s.fsm==="SIT_DOZE"){s.eyeState=t<.82?"CLOSED":"SQUINT";s.silhouettePose="squash";s.positionY=1;}
    else if(s.fsm==="CALL_PLAYER"){s.positionX=steppedLerp(s.startX,0,t);s.mouthOpen=phase%2===0;s.silhouettePose=phase%2?"wave":"neutral";}
    else if(s.fsm==="ACCESSORY_PLAY"){s.gazeX=-1;s.accessoryPulse=phase%2===0;s.earOffset=s.accessoryPulse?-1:0;}
    else if(s.fsm==="MIRROR_PLAYER"){s.silhouettePose=phase%3===0?"wave":(phase%3===1?"jump":"neutral");s.eyeState=phase%2?"SQUINT":"OPEN";}
}

const CreatureAnimator=Object.freeze({createState:createCreatureAnimationState,update:function(s,dt,context){
    // Migrate animation objects from earlier save versions safely.
    if(!Number.isFinite(s.positionX))s.positionX=0;if(!Number.isFinite(s.positionY))s.positionY=0;if(!s.silhouettePose)s.silhouettePose="neutral";
    s.elapsed=(s.elapsed||0)+dt;s.stateTime=(s.stateTime||0)+dt;s.tailPhase=(s.tailPhase||0)+dt;resetTransient(s);
    if(s.fsm==="IDLE")s.fsm="REST";
    if(s.fsm==="REST"){
        s.nextActionIn=(s.nextActionIn??randomIdleDelay())-dt;
        if(Math.floor(s.elapsed*1.2)%8===0)s.silhouettePose="squash";
        if(s.nextActionIn<=0)enterAction(s,chooseAction(context?.day||1,context));
    }else{
        applyActionPose(s,Math.min(1,s.stateTime/Math.max(.01,s.stateDuration)));
        if(s.stateTime>=s.stateDuration)finishAction(s);
    }
    s.positionX=Math.max(-5,Math.min(5,Math.round(s.positionX||0)));s.positionY=Math.max(-2,Math.min(2,Math.round(s.positionY||0)));
    return s;
},actionDefinitions:ACTION_DEFINITIONS});
