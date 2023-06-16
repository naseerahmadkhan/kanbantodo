import {View, ScrollView, Alert} from 'react-native';
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
  ActivityIndicator,
  MD2Colors,
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
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const getDataFromDB = async () => {
    const boardListTemp = [];
    const docRef = doc(db, 'todo', route.params.email);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      // console.log("Document data:", (docSnap.data()));
      const jsonData = docSnap.data();
      // if boardList array exist then do map()
      jsonData.boardList &&
        jsonData.boardList.map((item, index) => {
          // console.log(`item:${JSON.stringify(item)} index:${index}`)
          boardListTemp.push(item);
        });
      setIsLoading(false);
      return boardListTemp;
    } else {
      // doc.data() will be undefined in this case
      console.log('No such document!');
      setIsLoading(false);
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

  const updateBoard = async updatedBoardList => {
    try {
      //route.params.email
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

  const saveBoardNameInList = async () => {
    setIsSubmitted(true);
    const now = new Date();
    const formattedDate = date.format(now, 'DD-MMMM-YYYY HH:mm:ss A');
    const newBoardEntry = {boardName, date: formattedDate, todo: []};
    const beforeAddingBoardList = storeData.data.slice();
    const updatedBoardList = storeData.data.slice();
    // boardList.push(newBoardEntry);
    updatedBoardList.push(newBoardEntry);

    // storeData.data = boardList;

    try {
      await updateBoard(updatedBoardList);
      storeData.data = updatedBoardList;
      setBoardList(updatedBoardList);
      console.log('instered in db');
    } catch (err) {
      setBoardList(beforeAddingBoardList);
      console.log('err', err);
    } finally {
      setShowCreateBoardDialog(false);
      setIsSubmitted(false);
    }
  };

  // ! update board
  const updateBoardNameInList = async () => {
    setIsSubmitted(true);
    console.log(boardName, existingBoardName.boardName);
    const boardListBeforeUpdate = boardList.slice(); //duplicate array data

    const updatedBoardList = boardListBeforeUpdate.map(item => {
      if (item.boardName === existingBoardName.boardName) {
        let tempObj = Object.assign({}, item);
        tempObj.boardName = boardName;
        return tempObj;
      } else {
        return item;
      }
    });

    try {
      console.log('before update....');
      await updateBoard(updatedBoardList);
      storeData.data = updatedBoardList;
      setBoardList(updatedBoardList);
    } catch (error) {
      alert(JSON.stringify(error));
      setBoardList(boardListBeforeUpdate);
    } finally {
      setBoardName('');
      setIsSubmitted(false);
      setExistingBoardName(prev => ({...prev, visible: false}));
    }
  };

  // !

  const deleteBoard = async board => {
    setIsSubmitted(true);
    console.log('delete', board.boardName);
    console.log('store', storeData.data);

    let boardListBeforeDel = storeData.data.slice(); //duplicate array data
    let updatedBoardList = boardListBeforeDel.filter(function (item) {
      //callback function
      if (item.boardName != board.boardName) {
        //filtering criteria
        return item;
      }
    });
    console.log('after del', updatedBoardList);
    try {
      await updateBoard(updatedBoardList);
      storeData.data = updatedBoardList;
      setBoardList(updatedBoardList);
    } catch (e) {
      setBoardList(boardListBeforeDel);
      alert(JSON.stringify(e));
    } finally {
      setIsSubmitted(false);
    }
  };

  const handleBoardEdit = item => {
    console.log('edit', item);
    setExistingBoardName(prev => ({...prev, boardName: item, visible: true}));
    setBoardName(item);
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
                          disabled={isSubmitted ? true : false}
                          icon="pencil"
                          onPress={() => handleBoardEdit(item.boardName)}
                        />
                        <Button
                          disabled={isSubmitted ? true : false}
                          icon="delete"
                          // onPress={() => deleteBoard(item)}
                          onPress={() => deleteBoardDialog(item)}
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
          <Button
            disabled={isSubmitted ? true : false}
            onPress={() => saveBoardNameInList()}>
            Ok
          </Button>
          <Button
            disabled={isSubmitted ? true : false}
            onPress={() => setShowCreateBoardDialog(false)}>
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
          <Button
            // disabled={isSubmitted ? true : false}
            onPress={() => updateBoardNameInList()}>
            Ok
          </Button>
          <Button
            disabled={isSubmitted ? true : false}
            onPress={() => hideme()}>
            Cancel
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );

  const deleteBoardDialog = item =>
    Alert.alert(
      'Delete Board',
      `Are you really want to delete [${item.boardName}] board?`,
      [
        {
          text: 'Cancel',
          // onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'OK', onPress: () => deleteBoard(item)},
      ],
    );

  return (
    <>
      <Header navigation={navigation} />
      {!isLoading && todoBoards}
      {showCreateBoardDialog && createBoardDialog}
      {existingBoardName.visible && updateBoardDialog}
      {isLoading && (
        <View style={{flex: 1, justifyContent: 'center'}}>
          <ActivityIndicator
            animating={true}
            size={96}
            color={MD2Colors.blueA500}
          />
        </View>
      )}
    </>
  );
}
