#include <WiFi.h>
#include <HTTPClient.h>
#include <stdlib.h>  // Biblioteca para malloc e free

const char* ssid = "SSID";       // Nome da rede Wi-Fi
const char* password = "SENHA";  // Senha da rede Wi-Fi

const int sensorPin = 34;  // Pino ADC para o sensor SCT-013
const int numSamples = 200;  // Número de amostras para cálculo RMS
const float voltageRef = 3.3;  // Tensão de referência do ESP32
const float adcMax = 4095.0;   // Valor máximo do ADC do ESP32 (12 bits)
const float burdenResistor = 20.0;  // Resistor de carga (em ohms)
const float sensitivity = 100.0;    // Sensibilidade do sensor (100A:50mA)

// URL do servidor web para envio dos dados
const char* serverUrl = "http://servidor-teste/dados";

// Variáveis de conexão
WiFiClient client;
HTTPClient http;

// Estrutura de um nó da lista encadeada
struct Node {
  float corrente;   // Armazena o valor de corrente lido
  unsigned long timestamp;  // Armazena o horário da leitura (em milissegundos)
  Node* next;       // Aponta para o próximo nó
};

// Ponteiros para o início e fim da lista encadeada
Node* head = NULL;
Node* tail = NULL;

// Função para adicionar um novo valor à lista encadeada
void adicionarCorrente(float corrente, unsigned long timestamp) {
  Node* newNode = (Node*) malloc(sizeof(Node));  // Cria um novo nó
  newNode->corrente = corrente;
  newNode->timestamp = timestamp;
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
  float Irms = calcCurrentRMS();  // Calcular corrente RMS
  unsigned long currentTime = millis();  // Capturar o tempo atual (em milissegundos)
  
  adicionarCorrente(Irms, currentTime);  // Armazena corrente e horário na lista temporária

  if (millis() % 60000 == 0) {    // Após 1 minuto, envia os dados
    enviarDadosServidor();        // Enviar todos os dados ao servidor web
    limparLista();                // Limpa a lista após o envio
  }

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
    http.begin(client, serverUrl);       // Inicia a conexão HTTP
    http.addHeader("Content-Type", "application/x-www-form-urlencoded");

    // Preparar os dados para envio
    String httpRequestData = "correntes=";
    Node* temp = head;
    while (temp != NULL) {
      httpRequestData += "{" + String(temp->corrente) + "," + String(temp->timestamp) + "},";
      temp = temp->next;
    }
    httpRequestData.remove(httpRequestData.length() - 1);  // Remove última vírgula

    int httpResponseCode = http.POST(httpRequestData);  // Envia os dados por POST

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
