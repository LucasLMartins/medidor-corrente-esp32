#include <WiFi.h>
#include <HTTPClient.h>
#include <stdlib.h>  // Biblioteca para malloc e free
#include <ArduinoJson.h>

const char* ssid = "Moto E do pai";       // Nome da rede Wi-Fi
const char* password = "lucao321";  // Senha da rede Wi-Fi
const char* serverUrl = "http://4.203.106.105:4000/insertData"; // URL do servidor web para envio dos dados

const int sensorPin = 23;  // Pino ADC para o sensor SCT-013
const int numSamples = 200;  // Número de amostras para cálculo RMS
const float voltageRef = 3.3;  // Tensão de referência do ESP32
const float adcMax = 4095.0;   // Valor máximo do ADC do ESP32 (12 bits)
const float burdenResistor = 10.0;  // Resistor de carga (em ohms) SO FALTA ARRUMAR ISSO
const float sensitivity = 30.0;    // Sensibilidade do sensor (100A:50mA)

// Variáveis de conexão
WiFiClient client;
HTTPClient http;

float calcCurrentRMS() {
  long sumSquared = 0;  // Soma dos quadrados das leituras
  for (int i = 0; i < numSamples; i++) {
    int value = analogRead(sensorPin);  // Leitura do sinal
    float voltage = (value / adcMax) * voltageRef;  // Converter para tensão (0 a 3.3V)
    float current = (voltage - (voltageRef / 2.0)) / burdenResistor / sensitivity;  // Calcular corrente
    sumSquared += current * current;  // Somar quadrado da corrente
    delay(1);  // Intervalo curto entre as leituras
  }

  float meanSquared = sumSquared / numSamples;
  return sqrt(meanSquared);  // Retorna a corrente RMS
}

// Função para conectar ao Wi-Fi
void connectWiFi() {
  Serial.println("Conectando ao Wi-Fi...");
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }
  Serial.println("\nWi-Fi conectado!");
}

// Função para enviar os dados ao servidor web via HTTP POST
void enviarDadosServidor(float Irms) {
  if (WiFi.status() == WL_CONNECTED) {  // Verifica se está conectado à rede
    http.begin(serverUrl);       // Inicia a conexão HTTP
    http.addHeader("Content-Type", "application/json");

    // Preparar os dados para envio
    StaticJsonDocument<200> doc;
    doc["corrente"] = Irms;
    
    String jsonData;
    serializeJson(doc, jsonData);

    int httpResponseCode = http.POST(jsonData);

    Serial.println("Mensagem enviada");

    http.end();  // Fecha a conexão HTTP
  } else {
    Serial.println("Wi-Fi desconectado, tentando reconectar...");
    connectWiFi();
  }
}

void setup() {
  Serial.begin(115200);
  connectWiFi();  // Conectar ao Wi-Fi
}

void loop() {
  // float Irms = calcCurrentRMS();  // Calcular corrente RMS
  float Irms = 1.55;

  enviarDadosServidor(Irms);      // Enviar os dados ao servidor web
  
  delay(5000);
}