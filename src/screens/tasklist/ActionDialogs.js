import React from 'react';
import {List, Button, Dialog, Portal, TextInput} from 'react-native-paper';

export function TodoTab({hideme, isVisible, handleAction}) {
  return (
    <Portal>
      <Dialog visible={isVisible} onDismiss={() => hideme()}>
        <Dialog.Title>Actions</Dialog.Title>
        <Dialog.Content>
          <List.Item
            title="Start Doing"
            left={props => <List.Icon {...props} icon="run" />}
            onPress={() => handleAction('doing')}
          />

          <List.Item
            title="Mark Done"
            left={props => <List.Icon {...props} icon="thumb-up" />}
            onPress={() => handleAction('done')}
          />

          <List.Item
            title="Edit"
            left={props => <List.Icon {...props} icon="pencil" />}
            onPress={() => handleAction('edit')}
          />

          <List.Item
            title="Delete"
            left={props => <List.Icon {...props} icon="trash-can" />}
            onPress={() => handleAction('delete')}
          />
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => hideme()}>Dissmiss</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

export function DoingTab({hideme, isVisible, handleAction}) {
  return (
    <Portal>
      <Dialog visible={isVisible} onDismiss={() => hideme()}>
        <Dialog.Title>Actions</Dialog.Title>
        <Dialog.Content>
          <List.Item
            title="Sendback To Todo"
            left={props => <List.Icon {...props} icon="run" />}
            onPress={() => handleAction('todo')}
          />

          <List.Item
            title="Mark Done"
            left={props => <List.Icon {...props} icon="thumb-up" />}
            onPress={() => handleAction('done')}
          />

          <List.Item
            title="Edit"
            left={props => <List.Icon {...props} icon="pencil" />}
            onPress={() => handleAction('edit')}
          />

          <List.Item
            title="Delete"
            left={props => <List.Icon {...props} icon="trash-can" />}
            onPress={() => handleAction('delete')}
          />
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => hideme()}>Cancel</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

export function DoneTab({hideme, isVisible, handleAction}) {
  return (
    <Portal>
      <Dialog visible={isVisible} onDismiss={() => hideme()}>
        <Dialog.Title>Actions</Dialog.Title>
        <Dialog.Content>
          <List.Item
            title="Sendback to Todo"
            left={props => <List.Icon {...props} icon="run" />}
            onPress={() => handleAction('todo')}
          />

          <List.Item
            title="Sendback to Doing"
            left={props => <List.Icon {...props} icon="thumb-up" />}
            onPress={() => handleAction('doing')}
          />

          <List.Item
            title="Edit"
            left={props => <List.Icon {...props} icon="pencil" />}
            onPress={() => handleAction('edit')}
          />

          <List.Item
            title="Delete"
            left={props => <List.Icon {...props} icon="trash-can" />}
            onPress={() => handleAction('delete')}
          />
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => hideme()}>Cancel</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

export function AddNewTodoTaskDialog({
  isVisible,
  hide,
  setTodoName,
  addTodoInList,
  isSubmitted,
}) {
  return (
    <Portal>
      <Dialog visible={isVisible} onDismiss={() => hide()}>
        <Dialog.Title>Add Todo Task</Dialog.Title>

        <Dialog.Content>
          <TextInput
            style={{maxHeight: 150}}
            multiline={true}
            numberOfLines={3}
            label="Todo"
            onChangeText={val => setTodoName(val)}
          />
        </Dialog.Content>
        <Dialog.Actions>
          <Button disabled={isSubmitted ? true : false} onPress={() => addTodoInList()}>Ok</Button>
          <Button  disabled={isSubmitted ? true : false} onPress={() => hide()}>Cancel</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

export function UpdateTodoTaskDialog({
  isVisible,
  hideme,
  setUpdatedTodoName,
  handleAction,
  data,
  setData,
  isSubmitted
}) {
  console.log('update...', data);

  return (
    <Portal>
      <Dialog visible={isVisible} onDismiss={() => hideme()}>
        <Dialog.Title>Update Todo Task</Dialog.Title>

        <Dialog.Content>
          <TextInput
            style={{maxHeight: 150}}
            multiline={true}
            numberOfLines={3}
            label="Todo"
            onChangeText={val => setData(prev => ({...prev, name: val}))}
            value={data.name}
          />
        </Dialog.Content>
        <Dialog.Actions>
          <Button disabled={isSubmitted ? true : false} onPress={() => handleAction('update')}>update</Button>
          <Button disabled={isSubmitted ? true : false} onPress={() => hideme()}>Cancel</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}
