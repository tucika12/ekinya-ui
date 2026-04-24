import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.logo}>
          <Ionicons name="leaf" size={18} color="#A3E635" />
        </View>
        <Text style={styles.brand}>Ekinya</Text>
      </View>

      {/* TITLE */}
      <Text style={styles.title}>
        Tarımda{"\n"}
        <Text style={styles.highlight}>güvenli iş</Text>{"\n"}
        eşleştirme.
      </Text>

      <Text style={styles.desc}>
        Öğrenciler iş bulur, çiftçiler güvenilir işçi bulur.
      </Text>

      {/* CARD */}
      <View style={styles.card}>

        <Text style={styles.cardTitle}>Rolünü seç</Text>

        <Option
          icon="school-outline"
          title="Öğrenciyim"
          subtitle="Çalış • Kazan"
        />

        <Option
          icon="leaf-outline"
          title="Çiftçiyim"
          subtitle="İlan ver • Çalıştır"
        />

        <TouchableOpacity style={styles.ghost}>
          <Text style={styles.ghostText}>
            İlanları misafir olarak keşfet →
          </Text>
        </TouchableOpacity>

      </View>

    </View>
  );
}

function Option({ icon, title, subtitle }) {
  return (
    <TouchableOpacity style={styles.option}>
      <Ionicons name={icon} size={20} color="#1B5E20" />
      <View style={{ marginLeft: 10 }}>
        <Text style={styles.optionTitle}>{title}</Text>
        <Text style={styles.optionSub}>{subtitle}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F7F2",
    padding: 24,
    justifyContent: "center",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },

  logo: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#0F2A14",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  brand: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1B2E1B",
  },

  title: {
    fontSize: 34,
    fontWeight: "800",
    color: "#1B2E1B",
  },

  highlight: {
    color: "#A3E635",
  },

  desc: {
    marginTop: 12,
    color: "#666",
  },

  card: {
    marginTop: 30,
    backgroundColor: "#0F2A14",
    borderRadius: 24,
    padding: 20,
  },

  cardTitle: {
    color: "#A3E635",
    marginBottom: 15,
    fontWeight: "600",
  },

  option: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#BEF264",
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
  },

  optionTitle: {
    fontWeight: "700",
    color: "#1B2E1B",
  },

  optionSub: {
    fontSize: 12,
    color: "#2f2f2f",
  },

  ghost: {
    marginTop: 10,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#3f5f3f",
  },

  ghostText: {
    color: "#A3E635",
    textAlign: "center",
  },
});