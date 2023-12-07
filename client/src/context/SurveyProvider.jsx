import React, { createContext, useContext, useState } from "react";

const SurveyContext = createContext({
  surveyInfo: {},
  taskGroups: {},
  items: {},
  allowedEdit:1,
  setAllowedEdit:()=>{},
  createSurveyInfo: (survey) => {},
  createTaskGroup: (newTaskGroup) => {},
  createItems: (newItem) => {},
  getTaskGroup: () => {},
  getItems: () => {},
  addSubItem: (indexItem, newValueItem) => {},
  deleteSubItem: (indexItem, indexSubItem) => {},
  editSubItem: (indexItem, indexSubItem,indexRecordItem,valueRecord) => {},
  addTask: (indexTaskGroup, newTaskValue) => {},
  deleteTask: (indexTaskGroup, indexTask) => {},
  updateStatusTask: (indexTaskGroup, indexTask,statusTask) => {},
});

export const SurveyContextProvider = ({ children }) => {
  const [surveyInfo, setSurveyInfo] = useState({});
  const [taskGroups, setTaskGroups] = useState([]);
  const [allowedEdit, setAllowedEdit] = useState(1)
  const [items, setItems] = useState([]);

  function createSurveyInfo(newSurvey) {
    setSurveyInfo(newSurvey);
    setAllowedEdit(newSurvey.allowedEdit)
  }

  function getTaskGroup() {
    return taskGroups;
  }

  function createTaskGroup(newTaskGroup) {
    setTaskGroups(newTaskGroup);
  }


  const addTask = (groupIndex, task) => {
    const taskGroups = getTaskGroup();
    const newTaskGroups = [...taskGroups];
    newTaskGroups[groupIndex].taskList.push({
      nameTask: task,
      statusTask: -1,
    });
    setTaskGroups(newTaskGroups);
  };

  const deleteTask = (groupIndex, taskIndex) => {
    const taskGroups = getTaskGroup();
    const newTaskGroups = [...taskGroups];
    newTaskGroups[groupIndex].taskList.splice(taskIndex, 1);
    setTaskGroups(newTaskGroups);
  };

  const updateStatusTask = (groupIndex, taskIndex, status) => {
    const taskGroups = getTaskGroup();
    const newTaskGroups = [...taskGroups];
    newTaskGroups[groupIndex].taskList[taskIndex].statusTask = status;
    setTaskGroups(newTaskGroups);
  };

  function addSubItem(indexItem, newValueItem) {
    const items = getItems();
    const newItems = [...items];
    newItems[indexItem].listItems.push({
      rows: [],
      valueRecord: [
        {
          value: newValueItem,
        },
      ],
    });
    setItems(newItems);
  }

  function deleteSubItem(indexItem, indexSubItem) {
    const items = getItems();
    const newItems = [...items];
    newItems[indexItem].listItems.splice(indexSubItem, 1);
    setItems(newItems);
  }

  function editSubItem(indexItem,indexSubItem,indexRecordItem,valueRecord){
    const items = getItems();
    const newItems = [...items];
    newItems[indexItem].listItems[indexSubItem].valueRecord[indexRecordItem].value=valueRecord;
    setItems(newItems);
  }
  function getItems() {
    return items;
  }

  function createItems(newItems) {
    setItems(newItems);
  }

  return (
    <SurveyContext.Provider
      value={{
        surveyInfo,
        taskGroups,
        items,
        allowedEdit,
        createSurveyInfo,
        createTaskGroup,
        createItems,
        getTaskGroup,
        getItems,
        addSubItem,
        deleteSubItem,
        editSubItem,
        addTask,
        deleteTask,
        updateStatusTask,
        setAllowedEdit
      }}
    >
      {children}
    </SurveyContext.Provider>
  );
};

export const useSurvey = () => useContext(SurveyContext);
