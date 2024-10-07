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
            @click:append="processSubtitles()"
          />
        </v-col>
      </v-row>
    </v-form>
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

const files = ref<File[]>([])
const groupedWords = ref<any>([])

function processSubtitles() {
  const paths = files.value.map((f) => f.path)

  // Acessando o ipcRenderer via window
  window.ipcRenderer.send('process-subtitles', paths)
  window.ipcRenderer.on('process-subtitles', (event, resp) => {
    console.log('resp', resp)
    groupedWords.value = resp
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
