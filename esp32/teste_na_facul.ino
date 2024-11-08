#include <WiFi.h>
#include <HTTPClient.h>
#include <stdlib.h>  // Biblioteca para malloc e free
#include <ArduinoJson.h>

const char* ssid = "Moto E do pai";       // Nome da rede Wi-Fi
const char* password = "lucao321";  // Senha da rede Wi-Fi
const char* serverUrl = "http://4.203.106.105:4000/insertData"; // URL do servidor web para envio dos dados

const int sensorPin = 34;  // Pino ADC para o sensor SCT-013
const int numSamples = 200;  // Número de amostras para cálculo RMS
const float voltageRef = 3.3;  // Tensão de referência do ESP32
const float adcMax = 4095.0;   // Valor máximo do ADC do ESP32 (12 bits)
const float burdenResistor = 20.0;  // Resistor de carga (em ohms)
const float sensitivity = 100.0;    // Sensibilidade do sensor (100A:50mA)

// Variáveis de conexão
WiFiClient client;
HTTPClient http;

// Estrutura de um nó da lista encadeada
struct Node {
  float corrente;   // Armazena o valor de corrente lido
  Node* next;       // Aponta para o próximo nó
};

// Ponteiros para o início e fim da lista encadeada
Node* head = NULL;
Node* tail = NULL;

// Função para adicionar um novo valor à lista encadeada
void adicionarCorrente(float corrente) {
  Node* newNode = (Node*) malloc(sizeof(Node));  // Cria um novo nó
  newNode->corrente = corrente;
  newNode->next = NULL;
  
  if (tail == NULL) {
    // Se a lista estiver vazia, o novo nó é o primeiro
    head = newNode;
    tail = newNode;
  } else {
    // Adiciona o novo nó ao final da lista
    tail->next = newNode;
    tail = newNode;
  }
}

// Função para limpar a lista encadeada
void limparLista() {
  Node* temp = head;
  while (temp != NULL) {
    Node* next = temp->next;
    free(temp);  // Libera a memória do nó atual
    temp = next;
  }
  head = NULL;
  tail = NULL;
}

void setup() {
  Serial.begin(115200);
  connectWiFi();  // Conectar ao Wi-Fi
}

void loop() {
  // float Irms = calcCurrentRMS();  // Calcular corrente RMS
  //float Irms = 1.55;
  //unsigned long currentTime = millis();
  //adicionarCorrente(Irms);  // Armazena corrente na lista temporária

  //if (millis() % 5000 == 0) {    // Após 5 segundos, envia os dados
  //  enviarDadosServidor();        // Enviar todos os dados ao servidor web
  //  limparLista();                // Limpa a lista após o envio
  //}
  enviarDadosServidor();
  Serial.print("teste de print");
  delay(1000);  // Leitura a cada segundo
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

// Função para calcular a corrente RMS
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

// Função para enviar os dados ao servidor web via HTTP POST
void enviarDadosServidor() {
  if (WiFi.status() == WL_CONNECTED) {  // Verifica se está conectado à rede
    http.begin(serverUrl);       // Inicia a conexão HTTP
    http.addHeader("Content-Type", "application/json");

    // Preparar os dados para envio
    StaticJsonDocument<512> doc;
    JsonArray correnteArray = doc.createNestedArray("correntes");
    Node* temp = head;
    while (temp != NULL) {
      JsonObject correnteData = correnteArray.createNestedObject();
      correnteData["corrente"] = temp->corrente;
      temp = temp->next;
    }
    
    String jsonData;
    serializeJson(doc, jsonData);

    int httpResponseCode = http.POST(jsonData);

    // Verifica o código de resposta do servidor
    if (httpResponseCode > 0) {
      String response = http.getString();  // Recebe resposta do servidor
      Serial.println("Resposta do servidor: " + response);
    } else {
      Serial.println("Erro ao enviar dados: " + String(httpResponseCode));
    }

    http.end();  // Fecha a conexão HTTP
  } else {
    Serial.println("Wi-Fi desconectado, tentando reconectar...");
    connectWiFi();
  }
}