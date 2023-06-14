import {ScrollView} from 'react-native';
import React from 'react';
import {Button, Dialog, Portal} from 'react-native-paper';

import Autolink from 'react-native-autolink';

export default function TaskInDetailScreen2({
  hideDetailScreen,
  isVisibleDetailScreen,
  detailData,
}) {
  return (
    <Portal>
      <Dialog
        visible={isVisibleDetailScreen}
        onDismiss={() => hideDetailScreen()}>
        <Dialog.Title>Task</Dialog.Title>
        <Dialog.ScrollArea>
          <ScrollView contentContainerStyle={{paddingHorizontal: 24}}>
            <Autolink
              // Required: the text to parse for links
              text={detailData.data?.name}
              // Optional: enable email linking
              email={false}
              // Optional: enable hashtag linking to instagram
              hashtag="instagram"
              // Optional: enable @username linking to twitter
              mention="twitter"
              // Optional: enable phone linking
              phone="sms"
              stripPrefix={false}
              // Optional: enable URL linking
              // url={{ tldMatches: true }}
              // Optional: custom linking matchers
              // matchers={[MyCustomTextMatcher]}
            />
          </ScrollView>
        </Dialog.ScrollArea>
        <Dialog.Actions>
          <Button onPress={() => hideDetailScreen()}>Ok</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}
