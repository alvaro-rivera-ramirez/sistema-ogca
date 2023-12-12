import React, { createContext, useContext, useState } from "react";

const SurveyContext = createContext({
  surveyInfo: {},
  taskGroups: {},
  items: {},
  files:{},
  allowedEdit:1,
  setAllowedEdit:()=>{},
  createSurveyInfo: (survey) => {},
  createTaskGroup: (newTaskGroup) => {},
  createItems: (newItem) => {},
  getTaskGroup: () => {},
  getItems: () => {},
  addFile:(newFiles)=>{},
  deleteFile:(file)=>{},
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
  const [files, setFiles] = useState([]);
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
    newItems[indexItem].itemList.push({
      valueItem:newValueItem
    });
    setItems(newItems);
  }

  function deleteSubItem(indexItem, indexSubItem) {
    const items = getItems();
    const newItems = [...items];
    newItems[indexItem].itemList.splice(indexSubItem, 1);
    setItems(newItems);
  }
  function addFile( newFiles) {
    const fileList = getFiles();
    console.log(newFiles)
    const newFileList = [...fileList,...Array.from(newFiles)];
    setFiles(newFileList );
  }
  
  function addMultipleFile( newFiles) {
    const fileList = getFiles();
    const newFileList = [...fileList,...newFiles];
    setFiles(newFileList );
  }

  function deleteFile(file) {
    const fileList = getFiles();
    const newFileList = [...fileList];
    console.log(file)
    console.log(fileList.indexOf(file))
    newFileList.splice(fileList.indexOf(file), 1);
    setFiles(newFileList);
  }

  function editSubItem(indexItem,indexSubItem,newValue){
    const items = getItems();
    const newItems = [...items];
    newItems[indexItem].itemList[indexSubItem].valueItem=newValue;
    setItems(newItems);
  }

  function getItems() {
    return items;
  }

  function getFiles(){
    return files;
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
        files,
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
        setAllowedEdit,
        addFile,
        addMultipleFile,
        deleteFile
      }}
    >
      {children}
    </SurveyContext.Provider>
  );
};

export const useSurvey = () => useContext(SurveyContext);
