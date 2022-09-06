// For some odd reason, TypeScript wasn't able to locate *.vue files such as '@/App.vue' in the index.ts file
// Stackoverflow https://stackoverflow.com/questions/42002394/importing-vue-components-in-typescript-file

declare module "*.vue" {
    import Vue from 'vue'
    export default Vue
}