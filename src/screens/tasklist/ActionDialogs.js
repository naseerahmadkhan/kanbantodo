import React from 'react';
import {List, Button, Dialog, Portal, TextInput} from 'react-native-paper';

export function TodoActionDialog2({hideme, isVisible, handleAction}) {
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

export function DoingActionDialog2({hideme, isVisible, handleAction}) {
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

export function DoneActionDialog2({hideme, isVisible, handleAction}) {
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

export function AddNewTodoTaskDialog2({
  isVisible,
  hideme,
  setTodoName,
  addTodoInList,
}) {
  return (
    <Portal>
      <Dialog visible={isVisible} onDismiss={() => hideme()}>
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
          <Button onPress={() => addTodoInList()}>Ok</Button>
          <Button onPress={() => hideme()}>Cancel</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

export function UpdateTodoTaskDialog2({
  isVisible,
  hideme,
  setUpdatedTodoName,
  handleAction,
  data,
  setData,
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
          <Button onPress={() => handleAction('update')}>update</Button>
          <Button onPress={() => hideme()}>Cancel</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}
