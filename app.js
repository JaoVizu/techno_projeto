const vm = new Vue({
  el: '#app',
  data: {
    produtos: [],
    produto: false,
    moedas: ["BRL", "USD", "JPY", "EUR"],
    moeda: 'BRL'
  },
  filters : {
    numeroPreco(valor, moeda){
      const objetoMoeda = {
        BRL : 'pt-BR',
        USD : 'en-US',
        JPY: 'ja-JP',
        EUR: 'es-ES'
      }
      return valor.toLocaleString(objetoMoeda[moeda], {
        style: "currency",
        currency: moeda
      })
    }
  },
  methods : {
    fetchProdutos(){
      fetch('./api/produtos.json')
        .then(r => r.json())
        .then(r => this.produtos = r)
    },
    fetchProduto(id){
      fetch(`./api/produtos/${id}/dados.json`)
        .then(r => r.json())
        .then(r => this.produto = r)
    },
    abrirModal(id) {
      this.fetchProduto(id)
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      })
    },
    fecharModal({target, currentTarget}){
      if(target === currentTarget)
        this.produto = false
    }
  },
  created() {
    this.fetchProdutos();
  }
})