<template>
  <v-container fluid>
    <v-form>
      <v-row>
        <v-col :cols="12">
          <v-file-input
            :label="'Selecione as Legendas'"
            prepend-icon="mdi-message-text"
            append-icon="mdi-send"
            :variant="'outlined'"
            :multiple="true"
            :chips="true"
            v-model="files"
            @click:append="processSubtitles"
          />
        </v-col>
      </v-row>
    </v-form>

    <v-row>
      <v-col v-for="(file, index) in files" :key="file.name" :cols="12" class="mt-3">
        <h4>{{ file.name }}</h4>
        <!-- Barra de progresso para cada arquivo -->
        <v-progress-linear
          v-if="progress[index] < 100"
          :value="progress[index]"
          height="10"
          striped
          indeterminate
        ></v-progress-linear>
        <!-- Mensagem indicando conclusão do arquivo -->
        <div v-else>
          <p>Processado com sucesso!</p>
        </div>
      </v-col>
    </v-row>

    <div class="pills">
      <Pill v-for="word in groupedWords" :key="word.name" :name="word.name" :amount="word.amount" />
    </div>
  </v-container>
</template>

<script lang="ts" setup>
// Vue
import { ref } from 'vue'

// Components
import Pill from './Pill.vue'

// Refs para arquivos e palavras processadas
const files = ref<File[]>([])
const groupedWords = ref<any>([])

// Progresso para cada arquivo
const progress = ref<number[]>([])

function processSubtitles() {
  const paths = files.value.map((f) => f.path)

  // Inicializando o progresso com 0 para cada arquivo
  progress.value = files.value.map(() => 0)

  // Enviando os arquivos para o processo
  window.ipcRenderer.send('process-subtitles', paths)

  // Atualizando o progresso para cada arquivo
  window.ipcRenderer.on('process-subtitles', (event, resp) => {
    console.log('resp', resp)
    groupedWords.value = resp

    // Simulando progresso para cada arquivo (assumimos que a resposta chega após o processamento)
    resp.forEach((result: any, index: number) => {
      progress.value[index] = 100 // Progresso completo para o arquivo
    })
  })

  console.log('files', groupedWords.value)
}
</script>

<style>
.pills {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
</style>
