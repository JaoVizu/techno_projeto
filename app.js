const vm = new Vue({
  el: '#app',
  data: {
    produtos: [],
    produto: false,
    moedas: ["BRL", "USD", "JPY", "EUR"],
    moeda: 'BRL',
    carrinho: [],
    carrinhoAtivo: false,
    mensagemAlerta: 'Item Adicionado',
    alertaAtivo: false
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
  computed: {
    carrinhoTotal(){
      let total = 0
      if(this.carrinho.length){
        this.carrinho.forEach(item => {
          total += item.preco
        })
      }
      return total
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
    },
    clickForaCarrinho({ target, currentTarget }) {
      if (target === currentTarget) this.carrinhoAtivo = false;
    },
    adicionarItem(){
      this.produto.estoque--;
      const {id, nome, preco} = this.produto
      this.carrinho.push({id, nome, preco})
      this.alerta(`${nome} adicionado ao carrinho.`)
    },
    removerItem(index) {
      this.carrinho.splice(index, 1)
    },
    checarLocalStorage(){
      if(window.localStorage.carrinho)
        this.carrinho = JSON.parse(window.localStorage.carrinho)
    },
    compararEstoque(){
      const items = this.carrinho.filter(({id}) => id === this.produto.id)
      this.produto.estoque -= items.length
    },
    alerta(mensagem) {
      this.mensagemAlerta = mensagem
      this.alertaAtivo = true
      setTimeout(() => {
        this.alertaAtivo = false
      }, 1500)
    },
    router() {
      const hash = document.location.hash;
      if (hash)
        this.fetchProduto(hash.replace("#", ""));
    }
  },
  watch : {
    produto() {
      document.title = this.produto.nome || "Techno";
      const hash = this.produto.id || "";
      history.pushState(null, null, `#${hash}`);
      if(this.produto){
        this.compararEstoque()
      }
    },
    carrinho() {
      window.localStorage.carrinho = JSON.stringify(this.carrinho)
    }
  },
  created() {
    this.fetchProdutos()
    this.router()
    this.checarLocalStorage()
  }
})