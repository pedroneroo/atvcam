import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';

export default function App() {
  const [photoUri, setPhotoUri] = useState(null);
  const [loading, setLoading] = useState(false);
  const [savedMessage, setSavedMessage] = useState(false);

  // ---------- PERMISSÕES ----------

  const ensureCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permissão necessária',
        'Precisamos de acesso à câmera para tirar a foto. Ative a permissão nas configurações do dispositivo.'
      );
      return false;
    }
    return true;
  };

  const ensureLibraryReadPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permissão necessária',
        'Precisamos de acesso à galeria para escolher uma foto existente.'
      );
      return false;
    }
    return true;
  };

  const ensureLibraryWritePermission = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permissão necessária',
        'Precisamos de permissão para salvar a foto na sua galeria.'
      );
      return false;
    }
    return true;
  };

  const checkAllPermissions = async () => {
    const cam = await ImagePicker.getCameraPermissionsAsync();
    const libRead = await ImagePicker.getMediaLibraryPermissionsAsync();
    const libWrite = await MediaLibrary.getPermissionsAsync();

    Alert.alert(
      'Status das permissões',
      `📷 Câmera: ${cam.status === 'granted' ? 'Concedida ✅' : 'Não concedida ❌'}\n` +
        `🖼️ Ler galeria: ${libRead.status === 'granted' ? 'Concedida ✅' : 'Não concedida ❌'}\n` +
        `💾 Salvar na galeria: ${libWrite.status === 'granted' ? 'Concedida ✅' : 'Não concedida ❌'}`
    );
  };

  // ---------- AÇÕES ----------

  const openCamera = async () => {
    const ok = await ensureCameraPermission();
    if (!ok) return;

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.9,
      allowsEditing: false,
    });

    if (!result.canceled) {
      setSavedMessage(false);
      setPhotoUri(result.assets[0].uri);
    }
  };

  const openGallery = async () => {
    const ok = await ensureLibraryReadPermission();
    if (!ok) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.9,
    });

    if (!result.canceled) {
      setSavedMessage(false);
      setPhotoUri(result.assets[0].uri);
    }
  };

  const saveToGallery = async () => {
    if (!photoUri) return;
    const ok = await ensureLibraryWritePermission();
    if (!ok) return;

    try {
      setLoading(true);
      await MediaLibrary.saveToLibraryAsync(photoUri);
      setSavedMessage(true);
      Alert.alert('Sucesso', 'Foto salva na galeria! 🎉');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar a foto.');
    } finally {
      setLoading(false);
    }
  };

  const discardPhoto = () => {
    setPhotoUri(null);
    setSavedMessage(false);
  };

  // ---------- TELAS ----------

  if (photoUri) {
    return (
      <SafeAreaView style={styles.previewContainer}>
        <StatusBar barStyle="light-content" />
        <Image source={{ uri: photoUri }} style={styles.previewImage} />

        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.75)']}
          style={styles.previewOverlay}
        >
          <TouchableOpacity style={styles.closeButton} onPress={discardPhoto}>
            <Ionicons name="close" size={28} color="#fff" />
          </TouchableOpacity>

          {savedMessage && (
            <View style={styles.savedBadge}>
              <Ionicons name="checkmark-circle" size={18} color="#4ade80" />
              <Text style={styles.savedBadgeText}>Salva na galeria</Text>
            </View>
          )}

          <View style={styles.previewActions}>
            <TouchableOpacity
              style={[styles.roundButton, styles.discardButton]}
              onPress={discardPhoto}
            >
              <Ionicons name="trash-outline" size={24} color="#fff" />
              <Text style={styles.roundButtonLabel}>Descartar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.roundButton, styles.saveButton]}
              onPress={saveToGallery}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Ionicons name="download-outline" size={24} color="#fff" />
              )}
              <Text style={styles.roundButtonLabel}>Salvar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.roundButton, styles.newPhotoButton]}
              onPress={openCamera}
            >
              <Ionicons name="camera-outline" size={24} color="#fff" />
              <Text style={styles.roundButtonLabel}>Nova foto</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#1a1a2e', '#16213e', '#0f3460']}
        style={styles.gradientBackground}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <View style={styles.logoCircle}>
              <Ionicons name="camera" size={38} color="#fff" />
            </View>
            <Text style={styles.title}>StoryCam</Text>
            <Text style={styles.subtitle}>
              Capture o momento e compartilhe do seu jeito
            </Text>
          </View>

          <View style={styles.buttonsWrapper}>
            <TouchableOpacity style={styles.mainButton} onPress={openCamera}>
              <View style={[styles.iconWrapper, { backgroundColor: '#e94560' }]}>
                <Ionicons name="camera" size={26} color="#fff" />
              </View>
              <View style={styles.mainButtonTextWrapper}>
                <Text style={styles.mainButtonTitle}>Tirar Foto</Text>
                <Text style={styles.mainButtonSubtitle}>
                  Abrir a câmera do dispositivo
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#8888a0" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.mainButton} onPress={openGallery}>
              <View style={[styles.iconWrapper, { backgroundColor: '#0f3460' }]}>
                <Ionicons name="images" size={26} color="#fff" />
              </View>
              <View style={styles.mainButtonTextWrapper}>
                <Text style={styles.mainButtonTitle}>Escolher da Galeria</Text>
                <Text style={styles.mainButtonSubtitle}>
                  Selecionar uma foto já existente
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#8888a0" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.mainButton} onPress={checkAllPermissions}>
              <View style={[styles.iconWrapper, { backgroundColor: '#533483' }]}>
                <Ionicons name="shield-checkmark" size={26} color="#fff" />
              </View>
              <View style={styles.mainButtonTextWrapper}>
                <Text style={styles.mainButtonTitle}>Ver Permissões</Text>
                <Text style={styles.mainButtonSubtitle}>
                  Status de câmera e galeria
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#8888a0" />
            </TouchableOpacity>
          </View>

          <Text style={styles.footerText}>
            {Platform.OS === 'ios'
              ? 'As permissões são solicitadas na primeira vez que você usar cada função.'
              : 'Toque em um botão acima para começar.'}
          </Text>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}

// ---------- ESTILOS ----------

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientBackground: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 24,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
  },
  logoCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: 'rgba(255,255,255,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#b8b8d0',
    marginTop: 6,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  buttonsWrapper: {
    gap: 14,
  },
  mainButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  mainButtonTextWrapper: {
    flex: 1,
  },
  mainButtonTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  mainButtonSubtitle: {
    color: '#9797b3',
    fontSize: 12,
    marginTop: 2,
  },
  footerText: {
    textAlign: 'center',
    color: '#6f6f8f',
    fontSize: 12,
    marginTop: 16,
  },

  // Preview (estilo "story")
  previewContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  previewImage: {
    flex: 1,
    width: '100%',
    resizeMode: 'cover',
  },
  previewOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  savedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 14,
    gap: 6,
  },
  savedBadgeText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  previewActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  roundButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 84,
    height: 84,
    borderRadius: 20,
    gap: 4,
  },
  discardButton: {
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  saveButton: {
    backgroundColor: '#e94560',
  },
  newPhotoButton: {
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  roundButtonLabel: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
});
