import {View, StyleSheet, ScrollView} from 'react-native';
import React, {useEffect, useState, useContext} from 'react';
import {
  FAB,
  List,
  MD3Colors,
  TouchableRipple,
  Text,
  Button,
  TextInput,
  Dialog,
  Portal,
  Drawer,
} from 'react-native-paper';
// MaterialCommunityIcons can be used in react-native-paper

import {db} from '../../config/auth/firebase';
import {
  collection,
  addDoc,
  doc,
  setDoc,
  getDocs,
  getDoc,
  query,
  where,
  updateDoc,
} from 'firebase/firestore';

// npm i date-and-time
import date from 'date-and-time';
import {AppContext} from '../../store/store';
import Header from '../../components/header/Header';
import {styles} from '../../styles/styles';

export default function Dashboard({route, navigation}) {
  const storeData = useContext(AppContext);

  const [showCreateBoardDialog, setShowCreateBoardDialog] = useState(false);
  const [boardName, setBoardName] = useState('');
  const [boardList, setBoardList] = useState([]);
  const [existingBoardName, setExistingBoardName] = useState({visible: false});

  const getDataFromDB = async () => {
    const boardList = [];
    const docRef = doc(db, 'todo', route.params.email);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      // console.log("Document data:", (docSnap.data()));
      const jsonData = docSnap.data();
      // if boardList array exist then do map()
      jsonData.boardList &&
        jsonData.boardList.map((item, index) => {
          // console.log(`item:${JSON.stringify(item)} index:${index}`)
          boardList.push(item);
        });
      return boardList;
    } else {
      // doc.data() will be undefined in this case
      console.log('No such document!');
    }
  };

  useEffect(() => {
    (async function setBoardListIfExists() {
      let data = await getDataFromDB();
      storeData.data = data;
      console.log('data', data);
      console.log('store data in dashboard', storeData);
      setBoardList(prev => [...data]);
    })();
  }, []);

  const hideDialog = () => setShowCreateBoardDialog(false);

  const saveBoardNameInList = async () => {
    const now = new Date();
    const formattedDate = date.format(now, 'DD-MMMM-YYYY HH:mm:ss A');
    const newBoardEntry = {boardName, date: formattedDate, todo: []};
    boardList.push(newBoardEntry);

    storeData.data = boardList;

    try {
      let email = route.params.email;
      // let insertInFirebaseDB = await setDoc(doc(db, "todo", email),boardListDataToBeSendInDB);
      const todoRef = doc(db, 'todo', email);

      // Set the "capital" field of the city 'DC'
      await updateDoc(todoRef, {
        boardList: boardList,
      });

      console.log('instered in db');
    } catch (err) {
      console.log('err', err);
    } finally {
      setShowCreateBoardDialog(false);
    }
  };

  const updateBoard = async updatedBoardList => {
    try {
      const docRef = doc(db, 'todo', storeData.email);
      await updateDoc(docRef, {
        boardList: updatedBoardList,
      });

      console.log('after updated db');
      return true;
    } catch (err) {
      console.log(err);
      throw new Error(err);
    }
  };

  // ! update board
  const updateBoardNameInList = async () => {
    console.log(boardName, existingBoardName.boardName);

    let updatedBoardList = storeData.data;
    updatedBoardList.forEach(item => {
      console.log('item', item);
      if (item.boardName == existingBoardName.boardName) {
        item.boardName = boardName;
      }
    });

    try {
      updateBoard(updatedBoardList);
      storeData.data = updatedBoardList;
      setBoardList(updatedBoardList);
    } catch (error) {
      alert(JSON.stringify(error));
      setBoardList(boardListBeforeUpdate);
    }

    setBoardName('');
    setExistingBoardName(prev => ({...prev, visible: false}));
  };

  // !

  const deleteBoard = async board => {
    console.log('delete', board.boardName);
    console.log('store', storeData.data);
    let boardListBeforeDel = storeData.data;
    let updatedBoardList = boardListBeforeDel.filter(function (item) {
      //callback function
      if (item.boardName != board.boardName) {
        //filtering criteria
        return item;
      }
    });
    console.log('after del', updatedBoardList);
    try {
      updateBoard(updatedBoardList);
      storeData.data = updatedBoardList;
      setBoardList(updatedBoardList);
    } catch (e) {
      setBoardList(boardListBeforeDel);
      alert(JSON.stringify(e));
    }
  };

  const handleBoardEdit = item => {
    console.log('edit', item);
    setExistingBoardName(prev => ({...prev, boardName: item, visible: true}));
    setBoardName(item);
    console.log('test', existingBoardName);
  };

  const hideme = () => {
    setBoardName('');
    setExistingBoardName(prev => ({...prev, visible: false}));
  };

  const todoBoards = (
    <View style={{flex: 1}}>
      <ScrollView style={{flex: 0.9}}>
        <Text variant="titleMedium" style={{margin: 5}}>
          Boards
          {/* {route.params.email} */}
        </Text>

        {boardList &&
          boardList.map((item, index) => {
            return (
              <TouchableRipple
                key={index}
                onPress={() =>
                  navigation.navigate('TaskList', {
                    data: {
                      email: route.params.email,
                      boardName: item.boardName,
                      id: index,
                    },
                  })
                }
                // onPress={()=>console.log('hi',item.boardName)}
                rippleColor="rgba(25, 250, 0, .32)">
                <List.Item
                  title={item.boardName}
                  // description={item.date}
                  left={props => <List.Icon {...props} icon="card-outline" />}
                  right={props => {
                    return (
                      <View
                        style={{
                          flex: 1,
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'flex-end',
                        }}>
                        <Button
                          icon="pencil"
                          onPress={() => handleBoardEdit(item.boardName)}
                        />
                        <Button
                          icon="delete"
                          onPress={() => deleteBoard(item)}
                        />
                      </View>
                    );
                  }}
                />
              </TouchableRipple>
            );
          })}
      </ScrollView>

      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <FAB
          icon="plus"
          style={styles.fab}
          onPress={() => setShowCreateBoardDialog(true)}
          color="white"
          size="medium"
        />
      </View>
    </View>
  );

  const createBoardDialog = (
    <Portal>
      <Dialog visible={showCreateBoardDialog} onDismiss={hideDialog}>
        <Dialog.Title>Create Board</Dialog.Title>
        <Dialog.Content>
          <TextInput
            label="Board Name"
            onChangeText={val => setBoardName(val)}
          />
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => saveBoardNameInList()}>Ok</Button>
          <Button onPress={() => setShowCreateBoardDialog(false)}>
            Cancel
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );

  const updateBoardDialog = (
    <Portal>
      <Dialog visible={existingBoardName.visible} onDismiss={() => hideme()}>
        <Dialog.Title>Update Board</Dialog.Title>
        <Dialog.Content>
          <TextInput
            label="Board Name"
            onChangeText={val => setBoardName(val)}
            value={boardName}
          />
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => updateBoardNameInList()}>Ok</Button>
          <Button onPress={() => hideme()}>Cancel</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );

  return (
    <>
      <Header navigation={navigation} />
      {todoBoards}
      {showCreateBoardDialog && createBoardDialog}
      {existingBoardName.visible && updateBoardDialog}
    </>
  );
}
