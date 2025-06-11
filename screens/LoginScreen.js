import React, { useState } from 'react';
import {
  View, TextInput, Alert, Platform,
  TouchableOpacity, Text, StyleSheet, Image
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }) {
  const [schoolId, setSchoolId] = useState('');
  const [dob, setDob] = useState(null);
  const [showPicker, setShowPicker] = useState(false);

  const formatDate = (date) => {
    if (!date) return '';
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const handleDateChange = (event, selectedDate) => {
    setShowPicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDob(selectedDate);
    }
  };

  const handleLogin = async () => {
    if (!dob || !schoolId) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
      return;
    }

    try {
      const response = await fetch('http://miage.myartsonline.com/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ school_id: schoolId, dob: formatDate(dob) }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        await AsyncStorage.setItem('student', JSON.stringify(result.student));
        navigation.replace('Home', { student: result.student });
      } else {
        Alert.alert('Erreur', result.message || 'Échec de connexion.');
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de se connecter au serveur. ' + error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image
          source={{ uri: 'https://groupemiage.net/wp-content/uploads/2013/05/Logo-MIAGE-200x160.png' }}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Connexion Étudiant</Text>

        <TextInput
          placeholder="ID Scolaire"
          value={schoolId}
          onChangeText={setSchoolId}
          style={styles.input}
          placeholderTextColor="#999"
        />

        <TouchableOpacity style={styles.input} onPress={() => setShowPicker(true)}>
          <Text style={{ color: dob ? '#000' : '#999' }}>
            {dob ? formatDate(dob) : 'Date de naissance (YYYY-MM-DD)'}
          </Text>
        </TouchableOpacity>

        {showPicker && (
          <DateTimePicker
            value={dob || new Date(2000, 0, 1)}
            mode="date"
            display="default"
            onChange={handleDateChange}
            maximumDate={new Date()}
          />
        )}

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Se Connecter</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e9eff1',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 100,
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#007bff',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    width: '100%',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
