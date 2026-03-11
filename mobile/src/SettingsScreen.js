// SettingsScreen.js
import React, { useState } from "react";
import { View, Text, Switch, Button, StyleSheet } from "react-native";

export default function SettingsScreen({ notificationEnabled, setNotificationEnabled, lockTimeout, setLockTimeout }) {
  const [timeout, setTimeoutValue] = useState(lockTimeout);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Settings</Text>
      <View style={styles.row}>
        <Text>Notifications</Text>
        <Switch value={notificationEnabled} onValueChange={setNotificationEnabled} />
      </View>
      <View style={styles.row}>
        <Text>Lock Timeout (min)</Text>
        <Button title="-" onPress={() => setTimeoutValue(Math.max(1, timeout - 1))} />
        <Text>{timeout}</Text>
        <Button title="+" onPress={() => setTimeoutValue(timeout + 1)} />
      </View>
      <Button title="Save" onPress={() => setLockTimeout(timeout)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#fff' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 24 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, justifyContent: 'space-between' },
});
