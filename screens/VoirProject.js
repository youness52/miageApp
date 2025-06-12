import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
  TextInput
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig.extra.apiUrl;

export default function VoirProject() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterName, setFilterName] = useState('');
  const [expandedIds, setExpandedIds] = useState(new Set());
  const [debounceTimer, setDebounceTimer] = useState(null);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ name: filterName });
      const res = await fetch(`${API_URL}api/projects.php?${params}`, { credentials: 'include' });
      const json = await res.json();
      setProjects(json.success ? json.projects : []);
    } catch {
      setProjects([]);
    }
    setLoading(false);
  };

  useEffect(() => { fetchProjects(); }, []);

  useEffect(() => {
    if (debounceTimer) clearTimeout(debounceTimer);
    const timer = setTimeout(() => {
      fetchProjects();
    }, 500);
    setDebounceTimer(timer);
    return () => clearTimeout(timer);
  }, [filterName]);

  const toggleDesc = (id) => {
    const newSet = new Set(expandedIds);
    newSet.has(id) ? newSet.delete(id) : newSet.add(id);
    setExpandedIds(newSet);
  };

  const openFile = (file) => {
    if (!file) return;
    Linking.openURL(`${API_URL}uploads/${encodeURIComponent(file)}`).catch(() => {});
  };

  const renderProject = ({ item }) => {
    const expanded = expandedIds.has(item.id);

    return (
      <TouchableOpacity onPress={() => toggleDesc(item.id)} activeOpacity={0.9}>
        <View style={styles.card}>
          <Text style={styles.title}>{item.project_name}</Text>

          {expanded && (
            <>
              <Text style={styles.detail}><Text style={styles.label}>Étudiant:</Text> {item.student_name} ({item.class})</Text>
              <Text style={styles.detail}><Text style={styles.label}>Type:</Text> {item.project_type}</Text>
              {item.description ? <Text style={styles.desc}>{item.description}</Text> : null}

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
            </>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Rechercher ex: Gestion stock"
        style={styles.input}
        value={filterName}
        onChangeText={setFilterName}
      />
      {loading ? (
        <ActivityIndicator size="large" color="#2563eb" style={{ marginTop: 20 }} />
      ) : projects.length ? (
        <FlatList
          data={projects}
          keyExtractor={(p) => p.id.toString()}
          renderItem={renderProject}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      ) : (
        <Text style={styles.noData}>Aucun projet trouvé.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f4f6f8',
  },
  input: {
    backgroundColor: '#fff',
    marginBottom: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    fontSize: 16,
    elevation: 2,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 5,
    padding: 18,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 6,
  },
  label: {
    fontWeight: '600',
    color: '#475569',
  },
  detail: {
    fontSize: 15,
    color: '#334155',
    marginBottom: 6,
  },
  desc: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
    marginBottom: 12,
  },
  btnRow: {
    flexDirection: 'row',
    justifyContent:"space-evenly" ,
    marginTop: 12,
    padding:10,
    backgroundColor: '#999',
    borderRadius:10
  },
  btn: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 4,
  },
  primary: {
    backgroundColor: '#2563eb', // Blue
  },
  warning: {
    backgroundColor: '#f59e0b', // Amber
  },
  danger: {
    backgroundColor: '#dc2626', // Red
  },
  disabled: {
    display:"none",
    backgroundColor: '#d1d5db', // Gray
    shadowOpacity: 0,
    elevation: 0,
  },
  date: {
    marginTop: 12,
    fontSize: 13,
    color: '#6b7280',
    fontStyle: 'italic',
    textAlign: 'right',
  },
  noData: {
    marginTop: 30,
    textAlign: 'center',
    fontStyle: 'italic',
    color: '#9ca3af',
    fontSize: 17,
  },
});
