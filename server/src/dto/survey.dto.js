class SurveyViewDTO {
  constructor(
    props
  ) {
    Object.assign(this,props);
  }

  properties() {
    return {
      code: this.codeSurvey || null,
      allowedEdit: this.allowedEdit,
      module: this.module || null,
      condition: this.condition || null,
      component: this.component || null,
      indicator: this.indicator || null,
      checkitem: this.meansVerification || null,
      responsibleInstitute: this.institution || null,
      taskGroup: this.task || [],
      items:this.items||[]
    };
  }
  
  listPreview(){
    return{
      code:this.codeSurvey || null,
    }
  }
}

class ComponentDTO {
  constructor(props) {
    Object.assign(this, props);
  }

  properties() {
    return {
      code: this.code,
      name: this.name,
      content: this.content || null,
    };
  }
}

class ConditionDTO {
  constructor(props) {
    Object.assign(this, props);
  }
  properties() {
    return {
      code: this.code,
      name: this.name,
      content: this.content || null,
    };
  }
}

class IndicatorDTO {
  constructor(props) {
    Object.assign(this, props);
  }
  properties() {
    return {
      code: this.code,
      name: this.name,
      content: this.content || null,
    };
  }
}

class MeansVerificationDTO {
  constructor(props) {
    Object.assign(this, props);
  }
  properties() {
    return {
      code: this.code,
      name: this.name,
      content: this.content || null,
      scontent: this.scontent || null,
    };
  }
}

class TasksDTO {
  constructor(props) {
    Object.assign(this, props);
  }

  properties() {
    return {
      idTask: this.id_task,
      nameTask: this.name_task,
      statusTask: this.status_task,
    };
  }
}

class GroupTaskDTO{
  constructor(props) {
    Object.assign(this, props);
  }

  properties() {
    return {
      idGroupTask:this.idGroup,
      nameGroupTask: this.nameGroup,
      typeGroupTask: this.typeGroup,
      taskList:this.tasks,
    };
  }
}

class ModuleDTO {
  constructor(props) {
    Object.assign(this, props);
  }

  properties() {
    return {
      code: this.id_evaluation_module,
      name: this.name_evaluation_module,
    };
  }
}

class InstituteDTO {
  constructor(props) {
    Object.assign(this, props);
  }
  
  properties() {
    return {
      name: this.name_item_institute,
      content: this.name_institute,
    };
  }
}

class ItemDTO{
  constructor(props) {
    Object.assign(this, props);
  }
  properties() {
    return {
      idItem: this.idItem,
      nameItem: this.nameItem,
      typeItem: this.typeItem,
      columnsGroup: this.columnsGroup||[],
      columnsItem:this.columnsItem|| [],
      listItems:this.listItems||[]
    };
  }
}

class SurveyItemDTO{
  constructor(props) {
    Object.assign(this, props);
  }
  properties() {
    return {
      rows:this.rows||[],  
      valueRecord:this.valueRecord||[]
    };
  }
}

module.exports = {
  SurveyViewDTO,
  ModuleDTO,
  ConditionDTO,
  ComponentDTO,
  IndicatorDTO,
  MeansVerificationDTO,
  TasksDTO,
  GroupTaskDTO,
  InstituteDTO,
  ItemDTO,
  SurveyItemDTO
};
