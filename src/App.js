import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, StyleSheet, StatusBar, FlatList, TouchableOpacity } from 'react-native';

import api from './services/api';

export default function App() {
  const [repositories, setRepositories] = useState([])

  useEffect(() => {
    api.get('repositories').then(response => {
      setRepositories(response.data);
    })
  }, [])

  async function handleLikeToRepository(id) {
    const repositoryIndex = repositories.findIndex(repo => repo.id === id)
    if (repositoryIndex < 0) {
      console.log('Repositório -> id não encontrado')
      return;
    }
    const response = await api.post(`repositories/${id}/like`)
    likedRepository = response.data
    const updatedRepos = repositories.map(repo => {
      if (repo.id === id) {
        return likedRepository;
      } else {
        return repo;
      }
    })
    setRepositories(updatedRepos)
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
      <SafeAreaView style={styles.container}>
        <FlatList
          data={repositories}
          keyExtractor={repository => repository.id}
          renderItem={({ item: repository }) => (
            <>
              <Text style={styles.title}>{repository.title} ({repository.likes})</Text>
              <Text
                testID={`repository-likes-${repository.id}`}
              >
                {repository.likes} curtida{repository.likes > 1 ? "s" : ''}
              </Text>
              <TouchableOpacity
                activeOpacity={0.6}
                style={styles.button}
                onPress={() => handleLikeToRepository(repository.id)}
                testID={`like-button-${repository.id}`}
              >
                <Text style={styles.buttonText}>Curtir</Text>
              </TouchableOpacity>
            </>
          )}
        />

      </SafeAreaView>
    </>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#7159C1',
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  title: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#FFF',
    margin: 20,
    height: 50,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 16
  }

});