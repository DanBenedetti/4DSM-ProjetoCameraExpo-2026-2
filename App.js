// Importa o React e os hooks useState (para estado) e useEffect (para ciclo de vida)
import React, { useState, useEffect } from "react";
// Importa os componentes nativos do React Native para montar a tela
import { View, Text, Button, Image, StyleSheet, Alert } from "react-native";

// Importa a biblioteca do Expo para tirar foto, gravar vídeo ou selecionar da galeria
import * as ImagePicker from "expo-image-picker";
// Importa o objeto Camera do Expo para gerenciar as permissões de câmera e microfone
import { Camera } from "expo-camera";

// Declaração do componente principal do aplicativo
export default function App() {
  // Estado para armazenar o caminho (URI) da imagem ou vídeo capturado
  const [image, setImage] = useState(null);
  // Estado para armazenar o tipo de mídia atual ('image' ou 'video')
  const [mediaType, setMediaType] = useState("image");

  // Executa uma única vez quando a tela é carregada
  useEffect(() => {
    (async () => {
      try {
        // Permissão para usar a câmera
        await Camera.requestCameraPermissionsAsync();
        // Permissão para usar o microfone (necessária para gravar vídeo com áudio)
        await Camera.requestMicrophonePermissionsAsync();
        // Permissão para ler a galeria
        await ImagePicker.requestMediaLibraryPermissionsAsync();

        // Recupera uma gravação/foto interrompida caso o Android tenha fechado o app
        // enquanto a câmera estava aberta
        const pending = await ImagePicker.getPendingResultAsync();
        if (pending && pending.length > 0 && !pending[0].canceled) {
          const asset = pending[0].assets[0];
          setImage(asset.uri);
          setMediaType(asset.type === "video" ? "video" : "image");
        }
      } catch (error) {
        // Registra no console, sem derrubar o app com tela vermelha
        console.log("Erro ao pedir permissões:", error.message);
      }
    })();
  }, []);

  // Função para tirar foto com a câmera
  const takePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ["images"], // Somente imagens
        quality: 1,             // Qualidade máxima
        allowsEditing: true,    // Permite cortar/editar a foto
      });

      // Se o usuário não cancelou
      if (!result.canceled) {
        setImage(result.assets[0].uri);
        setMediaType("image");
        Alert.alert("Sucesso", "Foto capturada!");
      }
    } catch (error) {
      Alert.alert("Erro", "Erro ao tirar a foto: " + error.message);
    }
  };

  // Função para gravar vídeo com a câmera
  const recordVideo = async () => {
    try {
      // Pede o microfone antes de iniciar a gravação
      const micPermission = await Camera.requestMicrophonePermissionsAsync();
      if (micPermission.status !== "granted") {
        Alert.alert("Erro", "A permissão de microfone é necessária para gravar vídeos.");
        return;
      }

      // Abre a câmera no modo de vídeo, com configurações mais leves
      // para evitar que o emulador feche o app ao parar a gravação
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ["videos"],  // Somente vídeos
        videoMaxDuration: 10,    // Clipes curtos, de até 10 segundos
        videoQuality: ImagePicker.UIImagePickerControllerQualityType?.Low, // Qualidade baixa (mais leve)
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
        setMediaType("video");
        Alert.alert("Sucesso", "Vídeo gravado com sucesso!");
      }
    } catch (error) {
      Alert.alert("Erro", "Houve um erro ao gravar o vídeo: " + error.message);
    }
  };

  // Função para selecionar uma foto da galeria
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"], // Somente imagens
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setMediaType("image");
    }
  };

  // Função para selecionar um vídeo da galeria
  const pickVideo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["videos"], // Somente vídeos
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setMediaType("video");
    }
  };

  // Estrutura visual do aplicativo
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Exemplo com EXPO - Câmera</Text>

      {/* Tirar foto */}
      <Button title="Tirar Foto" onPress={takePhoto} />

      {/* Selecionar foto da galeria */}
      <View style={{ marginTop: 10 }}>
        <Button title="Selecionar Foto da Galeria" onPress={pickImage} />
      </View>

      {/* Gravar vídeo */}
      <View style={{ marginTop: 20 }}>
        <Button title="Gravar Vídeo" onPress={recordVideo} color="red" />
      </View>

      {/* Selecionar vídeo da galeria */}
      <View style={{ marginTop: 10 }}>
        <Button title="Selecionar Vídeo da Galeria" onPress={pickVideo} color="purple" />
      </View>

      {/* Exibe a foto, se a mídia atual for imagem */}
      {image && mediaType === "image" && (
        <Image source={{ uri: image }} style={styles.image} />
      )}

      {/* Exibe uma mensagem, se a mídia atual for vídeo */}
      {image && mediaType === "video" && (
        <Text style={{ marginTop: 20, fontSize: 16, color: "green", fontWeight: "bold" }}>
          Vídeo gravado ou selecionado com sucesso!
        </Text>
      )}
    </View>
  );
}

// Estilos da interface
const styles = StyleSheet.create({
  container: {
    flex: 1,                  // Ocupa todo o espaço da tela
    justifyContent: "center", // Centraliza verticalmente
    alignItems: "center",     // Centraliza horizontalmente
    padding: 16,              // Espaçamento interno
  },
  title: {
    fontSize: 22,             // Tamanho da fonte do título
    fontWeight: "bold",       // Negrito
    marginBottom: 20,         // Espaço abaixo do título
  },
  image: {
    width: 300,               // Largura da imagem
    height: 300,              // Altura da imagem
    marginTop: 20,            // Espaço acima da imagem
  },
});