import React, { useState, useEffect, use } from "react";
import { View, Text, Button, Image, StyleSheet, Alert } from "react-native";

import * as ImagePicker from "expo-image-picker";
import * as Camera from "expo-camera";
import * as MediaLibrary from "expo-media-library";

export default function App() {
  const [image, setImage] = useState(null);

  useEffect(() => {
    (async () => {
      await Camera.requestCameraPermissionsAsync();
      await ImagePicker.requestMediaLibraryPermissionsAsync();
      await MediaLibrary.requestPermissionsAsync();
    })();
  }, []);

  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: true,
    });

    //verifica se o usuario não cancelou a ação
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImage(uri);

      try {
        await MediaLibrary.saveToLibraryAsync(uri);
        Alert.alert("Sucesso", "Imagem salva na galeria!");
      } catch (error) {
        Alert.alert("Erro", "Erro ao salvar a imagem.");
      }
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Exemplo com Expo - Câmera</Text>
      <Button title="Tirar Foto" onPress={takePhoto} />
      <Button title="Galeria" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={styles.image} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  image: {
    width: 300,
    height: 300,
    marginTop: 20,
  },
});
