import {View, ScrollView} from 'react-native';
import React, {useState, useEffect, useContext} from 'react';
import {
  SegmentedButtons,
  List,
  FAB,
  IconButton,
  MD3Colors,
} from 'react-native-paper';
import date from 'date-and-time';
import {db} from '../../config/auth/firebase';
import {doc, getDoc, updateDoc} from 'firebase/firestore';

import {AppContext} from '../../store/store';

import TaskInDetailScreen2 from './TaskInDetailScreen';
import {
  AddNewTodoTaskDialog,
  UpdateTodoTaskDialog,
  TodoTab,
  DoingTab,
  DoneTab,
} from './ActionDialogs';
import {styles} from '../../styles/styles';
import Header from '../../components/header/Header';

export default function TaskList({route, navigation}) {
  const storeData = useContext(AppContext);

  const [tabValue, setTabValue] = React.useState('todo');

  const [showDialog, setShowDialog] = useState(false);
  const [showActionDialog, setShowActionDialog] = useState(false);
  const [showDoingActionDialog, setShowDoingActionDialog] = useState(false);
  const [showDoneActionDialog, setShowDoneActionDialog] = useState(false);
  const [showTaskInDetailScreen, setShowTaskInDetailScreen] = useState(false);
  const [showUpdatedTodo, setShowUpdatedTodo] = useState(false);

  const [todoName, setTodoName] = useState('');
  const [taskList, setTaskList] = useState([]);

  const [todoMark, settodoMark] = useState({});
  const [updateTaskData, setUpdateTaskData] = useState(null);
  const [beforeUpdateTaskData, setBeforeUpdateTaskData] = useState(null);

  const [taskInDetailData, setTaskInDetailData] = useState({});
  const listCounter = {todo: 0, doing: 0, done: 0};
  const [isSubmitted, setIsSubmitted] = useState(false);

  const getDataFromDB = async () => {
    const todoTaskList = [];
    const docRef = doc(db, 'todo', storeData.email);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      // console.log("Document data:", (docSnap.data()));
      const jsonData = docSnap.data();
      const id = route.params.data.id;
      // if boardList array exist then do map()
      jsonData.boardList[id].todo &&
        jsonData.boardList[id].todo.map((item, index) => {
          todoTaskList.push(item);
        });
      return todoTaskList;
    } else {
      // doc.data() will be undefined in this case
      console.log('No such document!');
    }
  };

  useEffect(() => {
    (async function setTaskListIfExists() {
      let data = await getDataFromDB();
      console.log('data', data);
      setTaskList(prev => [...data]);
    })();
  }, []);

  const handleTabChange = val => {
    setTabValue(val);
  };

  const showActionDialogBox = (item, index) => {
    setShowActionDialog(true);
    console.log(item, index);
    settodoMark({name: item.name, index});
  };

  const showDoingActionDialogBox = (item, index) => {
    setShowDoingActionDialog(true);
    console.log(item, index);
    settodoMark({name: item.name, index});
  };

  const showDoneActionDialogBox = (item, index) => {
    setShowDoneActionDialog(true);
    console.log(item, index);
    settodoMark({name: item.name, index});
  };

  // ! handle action universal

  const updateBoardListInDB = async updatedBoardList => {
    try {
      const docRef = doc(db, 'todo', storeData.email);
      await updateDoc(docRef, {
        boardList: updatedBoardList,
      });

      console.log('after updated db');
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  };

  const deleteTask = async () => {
    const boardId = route.params.data.id;
    let TaskListBeforeDel = storeData.data[boardId].todo;
    let updatedTaskListAfterDel = TaskListBeforeDel.filter(function (item) {
      //callback function
      if (item.status != 'delete') {
        //filtering criteria
        return item;
      }
    });

    let result = await updateBoardListInDB(storeData.data);
    if (!result) {
      return TaskListBeforeDel;
    }
    // setTaskList(updatedTaskList);
    return updatedTaskListAfterDel;
  };

  const taskUpdate = async (action, taskName) => {
    const boardId = route.params.data.id;
    const taskId = todoMark.index;
    const item = storeData.data[boardId].todo[taskId];
    let updatedTaskList;
    let result;

    console.log('task id', taskId);

    switch (action) {
      case 'done':
        if (item.name == taskName) {
          item.status = 'done';
          result = await updateBoardListInDB(storeData.data);
          if (result) {
            updatedTaskList = storeData.data[boardId].todo;
            setTaskList(updatedTaskList);
          }
        }

        break;

      case 'todo':
        if (item.name == taskName) {
          item.status = 'todo';
          result = await updateBoardListInDB(storeData.data);
          if (result) {
            updatedTaskList = storeData.data[boardId].todo;
            setTaskList(updatedTaskList);
          }
        }
        break;

      case 'doing':
        if (item.name == taskName) {
          item.status = 'doing';
          result = await updateBoardListInDB(storeData.data);
          if (result) {
            updatedTaskList = storeData.data[boardId].todo;
            setTaskList(updatedTaskList);
          }
        }
        break;

      case 'delete':
        if (item.name == taskName) {
          item.status = 'delete';
          updatedTaskList = await deleteTask();
          storeData.data[boardId].todo = updatedTaskList;
          setTaskList(updatedTaskList);
        }

        break;

      case 'edit':
        if (item.name == taskName) {
          item.name = updateTaskData.name;
          result = await updateBoardListInDB(storeData.data);
          if (result) {
            updatedTaskList = storeData.data[boardId].todo;
            setTaskList(updatedTaskList);
          }
        }
        break;
      default:
        break;
    }

    setShowActionDialog(false);
    setShowDoingActionDialog(false);
    setShowDoneActionDialog(false);
    setShowUpdatedTodo(false);
  };

  /* ********************************************************************************
  ? It handles Action Menu Dialog [Send todo, mark doing, mark done, delete and edit]
  ***********************************************************************************/
  const handleActionDialog2 = async (action, data) => {
    console.log('todomark', todoMark);
    switch (action) {
      case 'todo':
        console.log('todo called');
        await taskUpdate('todo', todoMark.name);
        break;
      case 'doing':
        await taskUpdate('doing', todoMark.name);
        break;
      case 'done':
        await taskUpdate('done', todoMark.name);
        break;
      case 'delete':
        await taskUpdate('delete', todoMark.name);
        break;
      case 'edit':
        // ! When on click edit option from menu control starts from here
        const boardId = route.params.data.id;
        let selectedTask = storeData.data[boardId].todo.filter(function (item) {
          //callback function
          if (item.name == todoMark.name) {
            //filtering criteria
            return item;
          }
        });

        setUpdateTaskData(selectedTask[0]);
        setBeforeUpdateTaskData(selectedTask[0]);
        console.log(
          'edit is to implemented',
          todoMark.name,
          boardId,
          updateTaskData,
        );
        setShowActionDialog(false);
        setShowDoingActionDialog(false);
        setShowDoneActionDialog(false);

        setShowUpdatedTodo(true);

        break;

      case 'update':
        // ! When click on update button in dialog box. Updates data
        setIsSubmitted(true);
        await taskUpdate('edit', beforeUpdateTaskData.name);
        setIsSubmitted(false);

        break;
      default:
        console.log('default', data);
    }
  };

  // !------------------------

  const showTaskInDetail = (item, index) => {
    console.log('show task in detail', item, index);
    setTaskInDetailData(prev => ({data: item, index: index}));
    console.log('taskindetaildata', taskInDetailData);
    setShowTaskInDetailScreen(true);
  };

  const todoList = taskList.map((item, index) => {
    if (item.status == 'todo') {
      listCounter.todo = listCounter.todo + 1;
      return (
        <View key={index}>
          <List.Item
            title={`${item.name}`}
            titleStyle={{color: 'green', fontWeight: 'bold'}}
            description={item.date}
            descriptionStyle={{color: 'grey', fontSize: 9}}
            onPress={() => showTaskInDetail(item, index)}
            left={props => <List.Icon {...props} icon="folder" />}
            right={props => (
              <IconButton
                icon="menu"
                iconColor={MD3Colors.neutral50}
                size={20}
                onPress={() => showActionDialogBox(item, index)}
              />
            )}
          />
        </View>
      );
    }
  });

  const doingList = taskList.map((item, index) => {
    if (item.status == 'doing') {
      listCounter.doing = listCounter.doing + 1;
      return (
        <View key={index}>
          <List.Item
            key={index}
            title={item.name}
            description={item.date}
            left={props => <List.Icon {...props} icon="folder" />}
            right={props => (
              <IconButton
                icon="menu"
                iconColor={MD3Colors.neutral50}
                size={20}
                onPress={() => showDoingActionDialogBox(item, index)}
              />
            )}
            onPress={() => showTaskInDetail(item, index)}
          />
        </View>
      );
    }
  });

  const doneList = taskList.map((item, index) => {
    if (item.status == 'done') {
      listCounter.done = listCounter.done + 1;
      return (
        <View key={index}>
          <List.Item
            key={index}
            title={item.name}
            description={item.date}
            left={props => <List.Icon {...props} icon="folder" />}
            right={props => (
              <IconButton
                icon="menu"
                iconColor={MD3Colors.neutral50}
                size={20}
                onPress={() => showDoneActionDialogBox(item, index)}
              />
            )}
            onPress={() => showTaskInDetail(item, index)}
          />
        </View>
      );
    }
  });

  // ! Hide New Todo Dialog
  const hideAddNewTodoTaskDialog = () => {
    console.log('hide me called');
    setShowDialog(false);
    setUpdateTaskData(null);
  };
  // ! Add New Todo in List
  const addTodoInList = async () => {
    setIsSubmitted(true);
    let newTaskList = [];
    newTaskList = taskList;

    let taskListBeforeAdding = taskList.slice();

    const now = new Date();
    const formattedDate = date.format(now, 'DD-MMMM-YYYY HH:mm:ss A');
    let newTodoData = {name: todoName, date: formattedDate, status: 'todo'};
    newTaskList.push(newTodoData);

    taskListBeforeAdding.push(newTodoData);
    let id = route.params.data.id;
    storeData.data[id].todo = taskListBeforeAdding;
    let result = await updateBoardListInDB(storeData.data);
    if (result) {
      setTaskList(taskListBeforeAdding);
    }
    hideAddNewTodoTaskDialog();
    setIsSubmitted(false);
  };

  return (
    <View style={{flex: 1}}>
      <Header navigation={navigation} />
      <SegmentedButtons
        value={tabValue}
        onValueChange={val => handleTabChange(val)}
        density="regular"
        theme={{roundness: 0}}
        buttons={[
          {
            value: 'todo',
            label: `Todo ${listCounter.todo}`,
            icon: 'gesture-double-tap',
            checkedColor: 'white',
            style: {
              backgroundColor: tabValue == 'todo' ? '#917FB3' : '#FDE2F3',
            },
          },
          {
            value: 'doing',
            label: `Doing ${listCounter.doing}`,
            icon: 'walk',
            checkedColor: 'white',
            style: {
              backgroundColor: tabValue == 'doing' ? '#917FB3' : '#FDE2F3',
            },
          },
          {
            value: 'done',
            label: `Done ${listCounter.done}`,
            icon: 'check',
            checkedColor: 'white',
            style: {
              backgroundColor: tabValue == 'done' ? '#917FB3' : '#FDE2F3',
            },
          },
        ]}
      />

      <ScrollView>
        {tabValue === 'todo' && todoList}
        {tabValue === 'doing' && doingList}
        {tabValue === 'done' && doneList}
      </ScrollView>

      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <FAB
          icon="plus"
          style={styles.fab}
          onPress={() => setShowDialog(true)}
          color="#ffff"
          size="medium"
        />
      </View>
      {/* {showDialog && addNewTodoTaskDialog} */}
      {showDialog && (
        <AddNewTodoTaskDialog
          isVisible={showDialog}
          hide={() => hideAddNewTodoTaskDialog()}
          setTodoName={value => setTodoName(value)}
          addTodoInList={() => addTodoInList()}
          updateData={updateTaskData}
          setUpdateData={(action, data) => handleActionDialog2(action, data)}
          isSubmitted={isSubmitted}
        />
      )}

      {showUpdatedTodo && (
        <UpdateTodoTaskDialog
          hideme={() => setShowUpdatedTodo(false)}
          isVisible={showUpdatedTodo}
          handleAction={(action, data) => handleActionDialog2(action, data)}
          data={updateTaskData}
          setData={setUpdateTaskData}
          isSubmitted={isSubmitted}
        />
      )}
      {/* {showActionDialog && todoActionDialog} */}

      {showActionDialog && (
        <TodoTab
          hideme={() => setShowActionDialog(false)}
          isVisible={showActionDialog}
          handleAction={action => handleActionDialog2(action)}
        />
      )}

      {/* {showDoingActionDialog && doingActionDialog} */}

      {showDoingActionDialog && (
        <DoingTab
          hideme={() => setShowDoingActionDialog(false)}
          isVisible={showDoingActionDialog}
          handleAction={action => handleActionDialog2(action)}
        />
      )}

      {/*! Shows Done Tab */}
      {showDoneActionDialog && (
        <DoneTab
          hideme={() => setShowDoneActionDialog(false)}
          isVisible={showDoneActionDialog}
          handleAction={action => handleActionDialog2(action)}
        />
      )}

      {/* {showTaskInDetailScreen && TaskInDetailScreen} */}
      {showTaskInDetailScreen && (
        <TaskInDetailScreen2
          hideDetailScreen={() => setShowTaskInDetailScreen(false)}
          isVisibleDetailScreen={showTaskInDetailScreen}
          detailData={taskInDetailData}
        />
      )}
    </View>
  );
}
