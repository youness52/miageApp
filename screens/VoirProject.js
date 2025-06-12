import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Linking, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

const API_URL = 'https://65ee-41-140-76-108.ngrok-free.app/miage/api/projects.php';

export default function VoirProject() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterName, setFilterName] = useState('');
  const [expandedIds, setExpandedIds] = useState(new Set());

  // Debounce timer id
  const [debounceTimer, setDebounceTimer] = useState(null);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ name: filterName });
      const res = await fetch(`${API_URL}?${params}`, { credentials: 'include' });
      const json = await res.json();
      setProjects(json.success ? json.projects : []);
    } catch {
      setProjects([]);
    }
    setLoading(false);
  };

  // Fetch on mount
  useEffect(() => { fetchProjects(); }, []);

  // Debounced effect on filterName change
  useEffect(() => {
    if (debounceTimer) clearTimeout(debounceTimer);
    // wait 500ms after user stops typing to fetch
    const timer = setTimeout(() => {
      fetchProjects();
    }, 500);
    setDebounceTimer(timer);

    // Cleanup on unmount or before next effect
    return () => clearTimeout(timer);
  }, [filterName]);

  const toggleDesc = (id) => {
    const newSet = new Set(expandedIds);
    newSet.has(id) ? newSet.delete(id) : newSet.add(id);
    setExpandedIds(newSet);
  };

  const openFile = (file) => {
    if (!file) return;
    Linking.openURL(`https://65ee-41-140-76-108.ngrok-free.app/miage/uploads/${encodeURIComponent(file)}`).catch(() => {});
  };

  const renderProject = ({ item }) => {
    const expanded = expandedIds.has(item.id);
    const desc = expanded ? item.description : (item.description?.slice(0, 150) + (item.description.length > 150 ? '...' : ''));
    return (
      <View style={styles.card}>
        <Text style={styles.title}>{item.project_name}</Text>
        <Text><Text style={styles.bold}>Étudiant:</Text> {item.student_name} ({item.class})</Text>
        <Text><Text style={styles.bold}>Type:</Text> {item.project_type}</Text>
        <Text style={styles.desc} onPress={() => item.description && toggleDesc(item.id)}>
          {desc} {item.description?.length > 150 && <Text style={styles.readMore}>{expanded ? ' Lire moins' : ' Lire plus'}</Text>}
        </Text>
        <View style={styles.btnRow}>
          <TouchableOpacity style={[styles.btn, item.report_pdf ? styles.primary : styles.disabled]} disabled={!item.report_pdf} onPress={() => openFile(item.report_pdf)}>
            <Icon name="file-pdf" size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, item.presentation_ppt ? styles.warning : styles.disabled]} disabled={!item.presentation_ppt} onPress={() => openFile(item.presentation_ppt)}>
            <Icon name="file-powerpoint" size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, item.source_rar ? styles.danger : styles.disabled]} disabled={!item.source_rar} onPress={() => openFile(item.source_rar)}>
            <Icon name="file-archive" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
        <Text style={styles.date}>Date: {item.upload_date}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
    
      <TextInput
        placeholder="Nom d'étudiant"
        style={styles.input}
        value={filterName}
        onChangeText={setFilterName}
      />
      {loading ? (
        <ActivityIndicator size="large" color="#2a6efc" style={{ marginTop: 20 }} />
      ) : projects.length ? (
        <FlatList data={projects} keyExtractor={p => p.id.toString()} renderItem={renderProject} contentContainerStyle={{ paddingBottom: 40 }} />
      ) : (
        <Text style={styles.noData}>Aucun projet trouvé.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#e5e9f0', // soft light background
  },
  input: {
    backgroundColor: '#fff',
    marginBottom: 16,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    fontSize: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 18,
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    // Android shadow
    elevation: 6,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e2e54',
    marginBottom: 8,
  },
  bold: {
    fontWeight: '700',
    color: '#344562',
  },
  desc: {
    color: '#555',
    fontSize: 15,
    lineHeight: 22,
    marginVertical: 10,
  },
  readMore: {
    color: '#3b82f6', // nicer blue
    fontWeight: '700',
  },
  btnRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
  },
  btn: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#3b82f6',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 4,
  },
  primary: {
    backgroundColor: '#3b82f6', // blue
  },
  warning: {
    backgroundColor: '#fbbf24', // amber
  },
  danger: {
    backgroundColor: '#ef4444', // red
  },
  disabled: {
    backgroundColor: '#cbd5e1', // light gray
    shadowOpacity: 0,
    elevation: 0,
  },
  date: {
    marginTop: 14,
    fontSize: 13,
    color: '#8b9cb5',
    fontStyle: 'italic',
    textAlign: 'right',
  },
  noData: {
    marginTop: 30,
    textAlign: 'center',
    fontStyle: 'italic',
    color: '#a0aec0',
    fontSize: 17,
  },
});

