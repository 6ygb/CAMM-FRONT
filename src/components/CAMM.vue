<template>
  <div class="min-h-screen bg-zama p-4 text-foreground">
    <!-- MetaMask Not Installed Screen -->
    <div v-if="!isMetaMaskInstalled" class="min-h-screen flex flex-col items-center justify-center">
      <div
        class="max-w-md w-full bg-surface rounded-xl shadow-lg overflow-hidden p-8 text-center border border-slate-700">
        <div class="mb-6">
          <img src="/metamask_icon.svg" alt="MetaMask Logo" class="h-24 mx-auto" />
        </div>
        <h2 class="text-2xl font-bold text-foreground mb-4">MetaMask Required</h2>
        <p class="text-muted-foreground mb-6">
          This application requires MetaMask to interact with the blockchain. Please install MetaMask to continue.
        </p>
        <a href="https://metamask.io/download/" target="_blank" rel="noopener noreferrer"
          class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-300 to-primary-200 text-primary-foreground rounded-md hover:from-primary-400 hover:to-primary-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface transition-all duration-200 font-medium">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd"
              d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
              clip-rule="evenodd" />
          </svg>
          Install MetaMask
        </a>
        <p class="text-muted-foreground text-sm mt-4">
          After installation, please refresh this page.
        </p>
      </div>
    </div>

    <!-- POC / Disclaimer Modal -->
    <div v-if="showPOCModal" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
      @click.self="closePOCModal" @keydown.esc="closePOCModal">
      <div class="bg-surface rounded-lg p-6 shadow-xl max-w-lg w-full border border-slate-700 outline-none"
        role="dialog" aria-modal="true" aria-labelledby="poc-title" aria-describedby="poc-desc">
        <div class="flex flex-col items-center text-center">
          <!-- CAMM logo -->
          <img src="/CammLogo.svg" alt="CAMM logo" class="h-12 w-12 mb-4 shrink-0" />

          <h3 id="poc-title" class="text-xl font-semibold text-foreground mb-2">
            Heads-up: Proof of Concept
          </h3>

          <div id="poc-desc" class="space-y-4 text-sm text-muted-foreground mb-2">
            <p>
              I’m not a front-end developer; this interface is provided as a
              <span class="font-semibold text-foreground">proof of concept</span> and is
              <span class="font-semibold text-foreground">not production-ready</span>.
            </p>

            <p>
              I built this alone as a <span class="font-semibold text-foreground">side project</span> and it’s hosted on
              my
              <span class="font-semibold text-foreground">personal server</span>. There are no guarantees regarding
              <span class="font-semibold text-foreground">availability, security,</span> or
              <span class="font-semibold text-foreground">ongoing maintenance</span> of this UI or the underlying CAMM
              protocol.
            </p>

            <p>
              Please see the <span class="font-semibold text-foreground">CAMM GitHub repository</span> and
              <span class="font-semibold text-foreground">Zama’s documentation</span> for protocol details.<br />
              While this AMM is initially based on <span class="font-semibold text-foreground">Uniswap&nbsp;V2</span>,
              it has been
              heavily modified to <span class="font-semibold text-foreground">support confidential transactions</span>
              and may be
              hard to understand at first glance.
            </p>

            <p>
              Keep in mind that CAMM is highly relying on Zama’s on-chain
              <span class="font-semibold text-foreground">decryption process</span>
              therefore performances are far from a traditional AMM.<br />
            </p>

            <p class="text-foreground">Thanks for your understanding and for trying CAMM!</p>
          </div>

          <a :href="CAMM_GITHUB_URL" target="_blank" rel="noopener noreferrer" class="inline-flex items-center mt-2 px-4 py-2 bg-gradient-to-r from-primary-300 to-primary-200
               text-primary-foreground rounded-md hover:from-primary-400 hover:to-primary-300
               focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
               focus:ring-offset-surface transition-all duration-200">
            View CAMM docs on GitHub
          </a>

          <a :href="CAMM_FRONT_GITHUB_URL" target="_blank" rel="noopener noreferrer"
            class="text-primary hover:underline hover:text-primary-300 mt-2 text-sm">
            View UI docs on GitHub
          </a>

          <p class="text-xs text-muted-foreground mt-4">
            I’m open to collaborations and/or questions:
            <a href="mailto:cy@6ygb.dev" class="text-primary hover:text-primary-300">cy@6ygb.dev</a>
            <br />
            <span class="opacity-70">Powered by</span>
            <a href="https://6ygb.dev" target="_blank" rel="noopener noreferrer"
              class="text-primary hover:text-primary-300"> 6ygb.dev</a>
          </p>

          <div class="flex items-center justify-between w-full mt-6">
            <label for="dont-show" class="flex items-center text-xs text-muted-foreground select-none cursor-pointer">
              <input id="dont-show" type="checkbox" v-model="dontShowAgain" class="mr-2 rounded" />
              Don’t show this again
            </label>
            <div class="space-x-2">
              <button type="button" @click="closePOCModal" class="btn btn--ghost">
                Close
              </button>
              <button type="button" @click="confirmPOCModal" autofocus class="btn btn--primary">
                I understand
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>


    <!-- Wrong Network Screen -->
    <div v-else-if="isWrongNetwork" class="min-h-screen flex flex-col items-center justify-center">
      <div class="max-w-lg w-full bg-surface rounded-xl shadow-lg overflow-hidden p-8 border border-border">
        <div class="mb-6 text-red-400 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-20 w-20 mx-auto" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-foreground mb-4 text-center">Wrong Network</h2>
        <p class="text-muted-foreground mb-6 text-center">
          Please connect to the correct network in your MetaMask wallet.
        </p>
        <p class="text-muted-foreground mb-6 text-center">
          If it's the first time you try interacting with {{ REQUIRED_NETWORK.chainName }}, follow the instructions
          below to add it.
        </p>

        <!-- Network Information Card -->
        <div class="bg-gradient-to-r from-slate-800 to-slate-900 rounded-lg p-6 mb-6 border border-slate-700">
          <h3 class="text-lg font-medium text-primary mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-primary" viewBox="0 0 20 20"
              fill="currentColor">
              <path fill-rule="evenodd"
                d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                clip-rule="evenodd" />
            </svg>
            Network Details
          </h3>

          <div class="space-y-4">
            <div class="flex justify-between items-center border-b border-slate-700 pb-2">
              <span class="text-sm font-medium text-muted-foreground">Network Name:</span>
              <div class="flex items-center">
                <span class="text-sm font-bold text-foreground bg-surface-2 px-3 py-1 rounded-full shadow-sm mr-2">{{
                  REQUIRED_NETWORK.chainName }}</span>
                <button @click="copyToClipboard(REQUIRED_NETWORK.chainName)"
                  class="text-primary hover:text-primary-300">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                    <path
                      d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                  </svg>
                </button>
              </div>
            </div>

            <div class="flex justify-between items-center border-b border-slate-700 pb-2">
              <span class="text-sm font-medium text-muted-foreground">Chain ID:</span>
              <div class="flex items-center">
                <span class="text-sm font-bold text-foreground bg-surface-2 px-3 py-1 rounded-full shadow-sm mr-2">{{
                  REQUIRED_NETWORK.chainId }}</span>
                <button @click="copyToClipboard(REQUIRED_NETWORK.chainId.toString())"
                  class="text-primary hover:text-primary-300">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                    <path
                      d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                  </svg>
                </button>
              </div>
            </div>

            <div class="flex justify-between items-center border-b border-slate-700 pb-2">
              <span class="text-sm font-medium text-muted-foreground">RPC URL:</span>
              <div class="flex items-center">
                <span
                  class="text-sm font-bold text-foreground bg-surface-2 px-3 py-1 rounded-full shadow-sm mr-2 truncate max-w-[200px]">{{
                    REQUIRED_NETWORK.rpcUrl }}</span>
                <button @click="copyToClipboard(REQUIRED_NETWORK.rpcUrl)" class="text-primary hover:text-primary-300">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                    <path
                      d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                  </svg>
                </button>
              </div>
            </div>

            <div class="flex justify-between items-center border-b border-slate-700 pb-2">
              <span class="text-sm font-medium text-muted-foreground">Currency Symbol:</span>
              <div class="flex items-center">
                <span class="text-sm font-bold text-foreground bg-surface-2 px-3 py-1 rounded-full shadow-sm mr-2">{{
                  REQUIRED_NETWORK.nativeCurrency.symbol }}</span>
                <button @click="copyToClipboard(REQUIRED_NETWORK.nativeCurrency.symbol)"
                  class="text-primary hover:text-primary-300">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                    <path
                      d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                  </svg>
                </button>
              </div>
            </div>

            <div class="flex justify-between items-center">
              <span class="text-sm font-medium text-muted-foreground">Explorer URL:</span>
              <div class="flex items-center">
                <a :href="REQUIRED_NETWORK.blockExplorerUrl" target="_blank" rel="noopener noreferrer"
                  class="text-sm font-bold text-foreground bg-surface-2 px-3 py-1 rounded-full shadow-sm hover:bg-slate-700 transition-colors mr-2 truncate max-w-[200px]">
                  {{ REQUIRED_NETWORK.blockExplorerUrl }}
                </a>
                <button @click="copyToClipboard(REQUIRED_NETWORK.blockExplorerUrl)"
                  class="text-primary hover:text-primary-300">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                    <path
                      d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div v-if="copiedText"
            class="mt-4 text-center text-sm text-emerald-300 font-medium bg-emerald-900/30 py-2 rounded-md">
            Copied to clipboard!
          </div>
        </div>

        <!-- Instructions -->
        <div class="bg-surface-2 rounded-lg p-4 border border-slate-700 mb-6">
          <h4 class="text-md font-medium text-primary mb-2 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-primary" viewBox="0 0 20 20"
              fill="currentColor">
              <path fill-rule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clip-rule="evenodd" />
            </svg>
            How to add this network to MetaMask
          </h4>
          <ol class="text-sm text-muted-foreground space-y-2 pl-6 list-decimal">
            <li>Open your MetaMask extension</li>
            <li>Click on the network dropdown at the top</li>
            <li>Click "Add Network"</li>
            <li>Click "Add a network manually"</li>
            <li>Fill in the details above</li>
            <li>Click "Save" to add the network</li>
            <li>Refresh this page after switching to the network</li>
          </ol>
        </div>
        <div class="flex items-center justify-center gap-3">
          <button @click="switchToRequiredNetwork" class="btn btn--primary mr-2">
            Switch to {{ REQUIRED_NETWORK.chainName }}
          </button>
          <button @click="refreshPage" class="btn btn--primary">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd"
                d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                clip-rule="evenodd" />
            </svg>
            Refresh Page
          </button>
        </div>
      </div>
    </div>

    <!-- Main Application -->
    <div v-else class="max-w-4xl mx-auto bg-surface rounded-xl shadow-lg overflow-hidden border border-border">
      <!-- Header -->
      <div class="bg-gradient-to-r from-[#1a1f2b] via-[#141922] to-[#0f131a] p-6 border-b border-primary-300/30">
        <div class="flex items-center gap-3">
          <!-- CAMM Logo -->
          <img src="/CammLogo.svg" alt="CAMM logo" class="h-12 w-12 md:h-14 md:w-14 shrink-0" />
          <div>
            <h1 class="text-2xl font-bold text-foreground">CAMM - Confidential Automated Market Maker</h1>
            <p class="text-muted-foreground">{{ config.TOKEN0_SYMBOL }}/{{ config.TOKEN1_SYMBOL }} Pair</p>
          </div>
        </div>
      </div>

      <!-- MetaMask Connection Banner -->
      <div v-if="!isConnected" class="bg-amber-900/30 border-b border-amber-700 p-4">
        <div class="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary mr-3" viewBox="0 0 20 20"
            fill="currentColor">
            <path fill-rule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clip-rule="evenodd" />
          </svg>
          <div>
            <p class="text-sm font-medium text-primary-200">
              Please connect your wallet to use this application.
            </p>
            <div class="mt-2">
              <button @click="connectMetaMask" class="btn btn--primary">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-5 w-5 mr-2 shrink-0" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                  aria-hidden="true">
                  <path d="M2.5 8.5c5.5-5.5 13.5-5.5 19 0" />
                  <path d="M5.5 11.5a10 10 0 0 1 13 0" />
                  <path d="M8.5 14.5a6 6 0 0 1 7 0" />
                  <circle cx="12" cy="18" r="1.0" fill="currentColor" />
                </svg>


                Connect Wallet
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Connected Account Info -->
      <div v-if="isConnected" class="bg-emerald-900/20 border-b border-emerald-700 p-4">
        <div class="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-emerald-400 mr-3" viewBox="0 0 20 20"
            fill="currentColor">
            <path fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clip-rule="evenodd" />
          </svg>
          <p class="text-sm font-medium text-emerald-200">
            Connected: {{ truncateAddress(account) }}
          </p>
        </div>
      </div>

      <!-- Tabs -->
      <div class="border-b border-border bg-surface">
        <nav class="flex -mb-px">
          <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id"
            class="flex-1 basis-0 min-w-0 py-4 text-center border-b-2 font-medium text-xs md:text-sm transition-all duration-200 relative"
            :class="[
              activeTab === tab.id
                ? 'border-transparent text-primary'
                : 'border-transparent text-muted-foreground hover:text-slate-200 hover:border-slate-600'
            ]">
            <span class="block truncate">{{ tab.name }}</span>
            <div v-if="activeTab === tab.id" class="absolute bottom-0 left-0 right-0 h-[3px] rounded-full bg-gold" />
          </button>
        </nav>
      </div>

      <!-- Tab Content -->
      <div class="p-6 bg-surface">
        <!-- Pair Selection Tab -->
        <div v-if="activeTab === 'pair'" class="space-y-6">
          <div class="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-lg shadow-md border border-slate-700">
            <h2 class="text-lg font-medium text-primary mb-6">Select Trading Pair</h2>

            <!-- Recommended Pair -->
            <div class="mb-6">
              <button @click="selectRecommendedPair" class="btn btn--primary w-full">
                Select Recommended default pair
              </button>
              <p class="text-sm text-muted-foreground mt-2 text-center"> {{ CAMM_ENV.DEFAULT_PAIR_ADDRESS }} </p>
            </div>

            <!-- Search Section -->
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-muted-foreground">Token0 Address</label>
                <input v-model="searchToken0Input" type="text" placeholder="0x..."
                  class="w-full px-3 py-2 border rounded-md border-slate-700 focus:ring-primary focus:border-amber-500 text-sm bg-surface-2 placeholder-slate-500" />
              </div>
              <div>
                <label class="block text-sm font-medium text-muted-foreground">Token1 Address</label>
                <input v-model="searchToken1Input" type="text" placeholder="0x..."
                  class="w-full px-3 py-2 border rounded-md border-slate-700 focus:ring-primary focus:border-amber-500 text-sm bg-surface-2 placeholder-slate-500" />
              </div>

              <button @click="searchPair" class="w-full btn btn--primary"
                :disabled="!isConnected || pending.searchPair">
                Search Pair
              </button>
            </div>

            <!-- Result -->
            <div v-if="searchedPair"
              class="mt-4 bg-emerald-900/30 border border-emerald-700 p-3 rounded-md text-emerald-200 text-sm">
              Pair found: <span class="font-mono">{{ searchedPair }}</span>
            </div>

            <div v-else-if="pairNotFound"
              class="mt-4 bg-red-900/30 border border-red-700 p-3 rounded-md text-red-200 text-sm">
              No pair exists for these tokens.
            </div>

            <!-- Search by Pair Address -->
            <div class="mt-6 pt-6 border-t border-slate-700">
              <h3 class="text-md font-medium text-primary mb-3">Load Pair by Address</h3>
              <div class="space-y-3">
                <div>
                  <label class="block text-sm font-medium text-muted-foreground">Pair Address</label>
                  <input v-model="searchPairAddrInput" type="text" placeholder="0x..."
                    class="w-full px-3 py-2 border rounded-md border-slate-700 focus:ring-primary focus:border-amber-500 text-sm bg-surface-2 placeholder-slate-500" />
                </div>
                <button @click="searchPairByAddress" class="w-full btn btn--primary"
                  :disabled="!isConnected || pending.searchPairByAddr">
                  Load Pair
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Swap Tab -->
        <div v-if="activeTab === 'swap'" class="space-y-6">
          <!-- Swap Interface -->
          <div class="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-lg shadow-md border border-slate-700">
            <h2 class="text-lg font-medium text-primary mb-6">Swap Tokens</h2>

            <!-- From Token -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-muted-foreground mb-2">From</label>
              <div class="bg-surface-2 p-4 rounded-lg border border-slate-700 shadow-sm">
                <div class="flex items-center justify-between mb-2">
                  <select v-model="fromCurrency"
                    class="block min-w-[100px] pl-3 pr-10 py-2 text-base border-slate-700 focus:outline-none focus:ring-primary focus:border-amber-500 sm:text-sm rounded-md bg-surface-2"
                    @change="calculateSwap">
                    <option :value="config.TOKEN0_SYMBOL">{{ config.TOKEN0_SYMBOL }}</option>
                    <option :value="config.TOKEN1_SYMBOL">{{ config.TOKEN1_SYMBOL }}</option>
                  </select>
                  <span class="text-sm text-muted-foreground">Balance: {{ fromCurrency === config.TOKEN0_SYMBOL ?
                    token0Balance : token1Balance }}</span>
                </div>
                <input type="number" v-model="fromAmount" @input="calculateSwap"
                  class="w-full text-2xl font-bold bg-transparent border-none focus:outline-none focus:ring-0 p-0 text-foreground placeholder-slate-500"
                  placeholder="0.00" :disabled="!isConnected" />
              </div>
            </div>

            <!-- Switch Button -->
            <div class="flex justify-center -my-3 relative z-10">
              <button @click="switchTokens"
                class="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-primary-300 to-primary-200 rounded-full hover:from-primary-400 hover:to-primary-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface border border-amber-400/30 shadow-md transition-all duration-200 transform hover:scale-105"
                :disabled="!isConnected">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary-foreground" viewBox="0 0 20 20"
                  fill="currentColor">
                  <path
                    d="M5 12a1 1 0 102 0V6.414l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L5 6.414V12zM15 8a1 1 0 10-2 0v5.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L15 13.586V8z" />
                </svg>
              </button>
            </div>

            <!-- To Token -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-muted-foreground mb-2">To</label>
              <div class="bg-surface-2 p-4 rounded-lg border border-slate-700 shadow-sm">
                <div class="flex items-center justify-between mb-2">
                  <select v-model="toCurrency"
                    class="block min-w-[100px] pl-3 pr-10 py-2 text-base border-slate-700 focus:outline-none focus:ring-primary focus:border-amber-500 sm:text-sm rounded-md bg-surface-2"
                    @change="calculateSwap">
                    <option :value="config.TOKEN0_SYMBOL">{{ config.TOKEN0_SYMBOL }}</option>
                    <option :value="config.TOKEN1_SYMBOL">{{ config.TOKEN1_SYMBOL }}</option>
                  </select>
                  <span class="text-sm text-muted-foreground">Balance: {{ toCurrency === config.TOKEN0_SYMBOL ?
                    token0Balance
                    : token1Balance }}</span>
                </div>
                <input type="number" v-model="toAmount"
                  class="w-full text-2xl font-bold bg-transparent border-none focus:outline-none focus:ring-0 p-0 text-foreground placeholder-slate-500"
                  placeholder="0.00" disabled />
              </div>
            </div>

            <!-- Exchange Rate -->
            <div class="bg-surface-2 p-3 rounded-md mb-6 border border-slate-700">
              <div class="flex justify-between items-center">
                <span class="text-sm text-muted-foreground">Exchange Rate</span>
                <span class="text-sm font-medium text-foreground" v-if="swapRate">
                  1 {{ fromCurrency }} = {{ swapRate.toFixed(4) }} {{ toCurrency }}
                </span>
                <span v-if="priceNote"
                  class="ml-2 text-xs px-2 py-0.5 rounded-full border border-slate-600 text-muted-foreground">
                  {{ priceNote }}
                </span>
                <span class="text-sm text-muted-foreground" v-else>
                  Loading...
                </span>
              </div>
            </div>
            <p class="text-sm text-muted-foreground text-center">Mind that the pair needs to be operator on both tokens
              for the swap to succeed.</p>
            <p class="text-sm text-muted-foreground text-center">Price/exchange rate is unprecise due to CAMM
              confidentiality constraints.</p>
            <p class="text-sm text-muted-foreground mb-4 text-center">Displayed rate shows a ~ ±7% imprecision.</p>
            <!-- Swap Button -->
            <button @click="executeSwap" class="w-full btn btn--primary"
              :disabled="!isConnected || !fromAmount || fromAmount <= 0 || pending.swap">
              {{ isConnected ? 'Swap' : 'Connect Wallet to Swap' }}
            </button>
          </div>

          <!-- Price Info -->
          <div class="bg-gradient-to-br from-slate-900 to-slate-800 p-4 rounded-lg border border-slate-700 shadow-md">
            <h3 class="text-md font-medium text-primary mb-2">Current {{ config.TOKEN0_SYMBOL }}/{{
              config.TOKEN1_SYMBOL }} Rate</h3>
            <div class="flex justify-between items-center">
              <p class="text-xl font-bold text-foreground">{{ T0T1Rate ? T0T1Rate.toFixed(4) : 'Loading...' }}</p>
              <button @click="updateSwapPrice()" class="btn btn--primary" :disabled="pending.fetchPrice">
                Refresh Rate
              </button>
            </div>
          </div>

          <button @click="requestPriceInfo()" class="w-2/5 min-w-[250px] mx-auto block px-4 py-3 
                    btn btn--primary" :disabled="!isConnected || pending.selfDecryptPrice">
            Self decrypt price
          </button>

        </div>

        <!-- Token Tab -->
        <div v-if="activeTab === 'token'" class="space-y-6">
          <!-- Token Balances -->
          <div class="bg-gradient-to-br from-slate-900 to-slate-800 p-4 rounded-lg border border-slate-700 shadow-md">
            <h2 class="text-lg font-medium text-primary mb-4">Token Balances</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="bg-surface-2 p-4 rounded-lg border border-slate-700 shadow-sm">
                <h3 class="font-medium text-muted-foreground">{{ config.TOKEN0_SYMBOL }}</h3>
                <p class="text-2xl font-bold text-foreground">{{ token0Balance }}</p>
              </div>
              <div class="bg-surface-2 p-4 rounded-lg border border-slate-700 shadow-sm">
                <h3 class="font-medium text-muted-foreground">{{ config.TOKEN1_SYMBOL }}</h3>
                <p class="text-2xl font-bold text-foreground">{{ token1Balance }}</p>
              </div>
            </div>
            <div class="mt-4">
              <button @click="getBalances" class="btn btn--primary w-full" :disabled="pending.balances">
                Get Balances
              </button>
            </div>
          </div>

          <!-- Mint Tokens -->
          <div class="bg-gradient-to-br from-slate-900 to-slate-800 p-4 rounded-lg border border-slate-700 shadow-md">
            <h2 class="text-lg font-medium text-primary mb-4">Claim airdrop</h2>
            <p class="text-sm text-muted-foreground mt-2 text-center"> Usual airdrop amount is 1K on supported tokens.
            </p>
            <p class="text-sm text-muted-foreground text-center">AirDrop might not be available on all ERC-7984 tokens.
            </p>
            <div class="space-y-4">
              <div class="flex flex-col space-y-2">
                <label class="text-sm font-medium text-muted-foreground">Token</label>
                <select v-model="tokenAirdrop"
                  class="block w-full pl-3 pr-10 py-2 text-base border-slate-700 focus:outline-none focus:ring-primary focus:border-amber-500 sm:text-sm rounded-md bg-surface-2">
                  <option :value="config.TOKEN0_SYMBOL">{{ config.TOKEN0_SYMBOL }}</option>
                  <option :value="config.TOKEN1_SYMBOL">{{ config.TOKEN1_SYMBOL }}</option>
                </select>
              </div>
              <button @click="claimAirdrop" class="w-full btn btn--primary" :disabled="!isConnected || pending.airdrop">
                Claim Airdrop
              </button>
            </div>
          </div>

          <!-- Transfer Tokens -->
          <div class="bg-gradient-to-br from-slate-900 to-slate-800 p-4 rounded-lg border border-slate-700 shadow-md">
            <h2 class="text-lg font-medium text-primary mb-4">Transfer Tokens</h2>
            <div class="space-y-4">
              <div class="flex flex-col space-y-2">
                <label class="text-sm font-medium text-muted-foreground">Token</label>
                <select v-model="transferToken"
                  class="block w-full pl-3 pr-10 py-2 text-base border-slate-700 focus:outline-none focus:ring-primary focus:border-amber-500 sm:text-sm rounded-md bg-surface-2">
                  <option :value="config.TOKEN0_SYMBOL">{{ config.TOKEN0_SYMBOL }}</option>
                  <option :value="config.TOKEN1_SYMBOL">{{ config.TOKEN1_SYMBOL }}</option>
                </select>
              </div>
              <div class="flex flex-col space-y-2">
                <label class="text-sm font-medium text-muted-foreground">Recipient Address</label>
                <input type="text" v-model="transferRecipient"
                  class="block w-full pl-3 pr-10 py-2 text-base border-slate-700 focus:outline-none focus:ring-primary focus:border-amber-500 sm:text-sm rounded-md bg-surface-2 placeholder-slate-500"
                  placeholder="0x..." />
              </div>
              <div class="flex flex-col space-y-2">
                <label class="text-sm font-medium text-muted-foreground">Amount</label>
                <input type="number" v-model="transferAmount"
                  class="block w-full pl-3 pr-10 py-2 text-base border-slate-700 focus:outline-none focus:ring-primary focus:border-amber-500 sm:text-sm rounded-md bg-surface-2 placeholder-slate-500"
                  placeholder="0.00" />
              </div>

              <button @click="transferTokens" class="btn btn--primary w-full"
                :disabled="!isConnected || !transferAmount || transferAmount <= 0 || !transferRecipient || pending.transfer">
                Transfer Tokens
              </button>
            </div>
          </div>

          <!-- Set Operator -->
          <div class="bg-gradient-to-br from-slate-900 to-slate-800 p-4 rounded-lg border border-slate-700 shadow-md">
            <h2 class="text-lg font-medium text-primary mb-4">Set Operator</h2>
            <div class="space-y-4">
              <div class="flex flex-col space-y-2">
                <label class="text-sm font-medium text-muted-foreground">Token</label>
                <select v-model="operatorToken"
                  class="block w-full pl-3 pr-10 py-2 text-base border-slate-700 focus:outline-none focus:ring-primary focus:border-amber-500 sm:text-sm rounded-md bg-surface-2">
                  <option :value="config.TOKEN0_SYMBOL">{{ config.TOKEN0_SYMBOL }}</option>
                  <option :value="config.TOKEN1_SYMBOL">{{ config.TOKEN1_SYMBOL }}</option>
                  <option :value="config.LPTOKEN_SYMBOL">{{ config.LPTOKEN_SYMBOL }}</option>
                </select>
              </div>
              <div class="flex flex-col space-y-2">
                <label class="text-sm font-medium text-muted-foreground">Operator Address</label>
                <input type="text" v-model="operatorAddress"
                  class="block w-full pl-3 pr-10 py-2 text-base border-slate-700 focus:outline-none focus:ring-primary focus:border-amber-500 sm:text-sm rounded-md bg-surface-2 placeholder-slate-500"
                  placeholder="0x..." />
              </div>
              <p class="text-sm text-muted-foreground mt-2 text-center"> Operator allowance duration is 10 minutes. </p>
              <button @click="setOperator" class="w-full btn btn--primary" :disabled="!isConnected || pending.operator">
                Set Operator
              </button>
            </div>
          </div>
        </div>

        <!-- AMM Tab -->
        <div v-if="activeTab === 'amm'" class="space-y-6">
          <!-- Liquidity Pool Information -->
          <div class="bg-gradient-to-br from-slate-900 to-slate-800 p-4 rounded-lg border border-slate-700 shadow-md">
            <h2 class="text-lg font-medium text-primary mb-4">Liquidity Pool Information</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="bg-surface-2 p-4 rounded-lg border border-slate-700 shadow-sm">
                <h3 class="font-medium text-muted-foreground">{{ config.TOKEN0_SYMBOL }} Obfuscated Reserve</h3>
                <p class="text-2xl font-bold text-foreground">{{ reserves.token0 }}</p>
              </div>
              <div class="bg-surface-2 p-4 rounded-lg border border-slate-700 shadow-sm">
                <h3 class="font-medium text-muted-foreground">{{ config.TOKEN1_SYMBOL }} Obfuscated Reserve</h3>
                <p class="text-2xl font-bold text-foreground">{{ reserves.token1 }}</p>
              </div>
            </div>
            <div class="bg-surface-2 mx-auto w-1/2 mt-4 block p-4 rounded-lg border border-slate-700 shadow-sm">
              <h3 class="font-medium text-muted-foreground">Your LP Balance</h3>
              <p class="text-2xl font-bold text-foreground">{{ lpBalance }}</p>
            </div>
            <div class="mt-4 flex space-x-2">
              <button @click="getLPBalance" class="btn btn--primary w-1/2" :disabled="pending.lpBalance">
                Get LP Balance
              </button>
              <button @click="getPairReserves" class="btn btn--primary w-1/2" :disabled="pending.reserves">
                Get Obfuscated Reserves
              </button>
            </div>
          </div>

          <!-- Add Liquidity -->
          <div class="bg-gradient-to-br from-slate-900 to-slate-800 p-4 rounded-lg border border-slate-700 shadow-md">
            <h2 class="text-lg font-medium text-primary mb-4">Add Liquidity</h2>
            <div class="space-y-4">
              <div class="flex flex-col space-y-2">
                <label class="text-sm font-medium text-muted-foreground">{{ config.TOKEN0_SYMBOL }} Amount</label>
                <input type="number" v-model="addLiquidityAmount0"
                  class="block w-full pl-3 pr-10 py-2 text-base border-slate-700 focus:outline-none focus:ring-primary focus:border-amber-500 sm:text-sm rounded-md bg-surface-2 placeholder-slate-500"
                  placeholder="0.00" />
              </div>
              <div class="flex flex-col space-y-2">
                <label class="text-sm font-medium text-muted-foreground">{{ config.TOKEN1_SYMBOL }} Amount</label>
                <input type="number" v-model="addLiquidityAmount1"
                  class="block w-full pl-3 pr-10 py-2 text-base border-slate-700 focus:outline-none focus:ring-primary focus:border-amber-500 sm:text-sm rounded-md bg-surface-2 placeholder-slate-500"
                  placeholder="0.00" />
              </div>
              <button @click="addLiquidity" class="w-full btn btn--primary"
                :disabled="!isConnected || !addLiquidityAmount0 || !addLiquidityAmount1 || addLiquidityAmount0 <= 0 || addLiquidityAmount1 <= 0 || pending.addLiquidity">
                Add Liquidity
              </button>
            </div>
          </div>

          <!-- Remove Liquidity -->
          <div class="bg-gradient-to-br from-slate-900 to-slate-800 p-4 rounded-lg border border-slate-700 shadow-md">
            <h2 class="text-lg font-medium text-primary mb-4">Remove Liquidity</h2>
            <div class="space-y-4">
              <div class="flex flex-col space-y-2">
                <label class="text-sm font-medium text-muted-foreground">LP Token Amount</label>
                <input type="number" v-model="removeLiquidityAmount"
                  class="block w-full pl-3 pr-10 py-2 text-base border-slate-700 focus:outline-none focus:ring-primary focus:border-amber-500 sm:text-sm rounded-md bg-surface-2 placeholder-slate-500"
                  placeholder="0.00" />
              </div>
              <button @click="removeLiquidity" class="w-full btn btn--primary"
                :disabled="!isConnected || !removeLiquidityAmount || removeLiquidityAmount <= 0 || pending.removeLiquidity">
                Remove Liquidity
              </button>
            </div>
          </div>


          <!-- Refund Claim -->
          <div class="bg-gradient-to-br from-slate-900 to-slate-800 p-4 rounded-lg border border-slate-700 shadow-md">
            <h2 class="text-lg font-medium text-primary mb-4">Refund Claim</h2>
            <div class="space-y-4">
              <!-- Refund type -->
              <div class="flex flex-col space-y-2">
                <label class="text-sm font-medium text-muted-foreground">Refund Type</label>
                <select v-model="selectedRefundType"
                  class="block w-full pl-3 pr-10 py-2 text-base border-slate-700 focus:outline-none focus:ring-primary focus:border-amber-500 sm:text-sm rounded-md bg-surface-2">
                  <option value="swap">Swap refund (default)</option>
                  <option value="add">Add-liquidity refund</option>
                  <option value="remove">Remove-liquidity refund</option>
                </select>
              </div>

              <!-- Request ID -->
              <div class="flex flex-col space-y-2">
                <label class="text-sm font-medium text-muted-foreground">Request ID</label>
                <input type="number" v-model.number="refundRequestId" placeholder="e.g. 12345"
                  class="block w-full pl-3 pr-10 py-2 text-base border-slate-700 focus:outline-none focus:ring-primary focus:border-amber-500 sm:text-sm rounded-md bg-surface-2 placeholder-slate-500" />
              </div>

              <p class="text-sm text-muted-foreground mt-2 text-center">
                Tip: copy an ID from <span class="font-medium text-foreground">Decryption Requests</span> below.
              </p>

              <!-- Submit -->
              <button @click="submitRefund" class="w-full btn btn--primary"
                :disabled="!isConnected || !isValidRefundId || pending.refund">
                {{ refundButtonLabel }}
              </button>
            </div>
          </div>


          <!-- Stored Decryption Requests -->
          <div
            class="bg-gradient-to-br from-slate-900 to-slate-800 p-4 rounded-lg border border-slate-700 shadow-md mt-4">
            <h2 class="text-lg font-medium text-primary mb-4">Decryption Requests</h2>

            <div v-if="storedRequests.length > 0" class="max-h-48 overflow-y-auto space-y-2 pr-1">
              <div v-for="(req, index) in storedRequests.slice()" :key="index"
                class="flex justify-between items-center bg-surface-2 p-3 rounded-md border border-slate-700 shadow-sm">
                <div>
                  <p class="text-sm font-medium text-slate-200">{{ req.type }}</p>
                  <p class="text-xs text-muted-foreground">Block: {{ req.blockNumber }}</p>
                  <p class="text-xs text-slate-500">Saved: {{ new Date(req.timestamp).toLocaleString() }}</p>
                  <p class="text-xs text-primary-300 font-mono">Request ID: {{ req.requestId }}</p>
                  <p class="text-xs text-primary-300 font-mono">
                    Pair:
                    <span :title="req.pairAddress || 'unknown'"
                      class="cursor-pointer underline-offset-2 hover:underline"
                      @click="req.pairAddress && handleCopy(req.pairAddress)">
                      {{ req.pairAddress ? truncateAddress(req.pairAddress) : 'unknown' }}
                    </span>
                    <span v-if="copiedText === req.pairAddress" class="ml-2 text-emerald-300">Copied!</span>
                  </p>
                </div>
                <button @click="handleCopy(req.requestId)" :class="[
                  'btn px-2 py-1 transition-colors',
                  copiedText === req.requestId
                    ? 'bg-emerald-500 text-primary-foreground animate-pulse'
                    : 'bg-gradient-to-r from-primary-300 to-primary-200 text-primary-foreground hover:from-primary-400 hover:to-primary-300'
                ]">
                  {{ copiedText === req.requestId ? 'Copied!' : 'Copy ID' }}
                </button>
              </div>
            </div>

            <div v-else class="text-sm text-muted-foreground">No decryption requests saved yet.</div>

            <div class="mt-3">
              <button v-if="storedRequests.length > 0" @click="clearDecryptionRequests"
                class="px-3 py-2 text-xs bg-red-600 text-white rounded-md hover:bg-red-500 transition">
                Clear All
              </button>
            </div>
          </div>

        </div>

        <!-- Launch Tab -->
        <div v-if="activeTab === 'launch'" class="space-y-6">

          <!-- Deploy Token -->
          <div class="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-lg shadow-md border border-slate-700">
            <h2 class="text-lg font-medium text-primary mb-6 flex items-center gap-2">
              Deploy Confidential Token (ERC-7984)
            </h2>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="bg-surface-2 p-4 rounded-lg border border-slate-700 shadow-sm">
                <label class="text-sm text-muted-foreground">Name</label>
                <input v-model="newTokenName" type="text"
                  class="mt-1 w-full px-3 py-2 border rounded-md border-slate-700 focus:ring-primary focus:border-amber-500 text-sm bg-surface-2 placeholder-slate-500"
                  placeholder="e.g. Confidential USD" />
              </div>
              <div class="bg-surface-2 p-4 rounded-lg border border-slate-700 shadow-sm">
                <label class="text-sm text-muted-foreground">Symbol</label>
                <input v-model="newTokenSymbol" type="text"
                  class="mt-1 w-full px-3 py-2 border rounded-md border-slate-700 focus:ring-primary focus:border-amber-500 text-sm bg-surface-2 placeholder-slate-500"
                  placeholder="e.g. cUSD" />
              </div>
            </div>

            <div class="mt-4">
              <button @click="deployToken" class="w-full btn btn--primary"
                :disabled="!isConnected || !newTokenName || !newTokenSymbol || pending.deployToken">
                Deploy Token
              </button>
              <p class="text-xs text-muted-foreground mt-2 text-center">
                Your token will appear in the history below after deployment.
              </p>
            </div>
          </div>

          <!-- Create Pair -->
          <div class="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-lg shadow-md border border-slate-700">
            <h2 class="text-lg font-medium text-primary mb-4">Create Pair (ERC-7984 tokens)</h2>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="bg-surface-2 p-4 rounded-lg border border-slate-700 shadow-sm">
                <label class="text-sm text-muted-foreground">Token 0 Address</label>
                <input v-model="createPairT0" type="text" placeholder="0x..."
                  class="mt-1 w-full px-3 py-2 border rounded-md border-slate-700 focus:ring-primary focus:border-amber-500 text-sm bg-surface-2 placeholder-slate-500" />
                <!-- Quick pick from history -->
                <select v-if="deployedTokens.length"
                  class="mt-2 w-full pl-3 pr-10 py-2 text-sm rounded-md border border-slate-700 bg-surface-2"
                  @change="(e: any) => (createPairT0 = e.target.value || createPairT0)">
                  <option value="">Pick from history…</option>
                  <option v-for="t in deployedTokens" :key="t.address" :value="t.address">
                    {{ t.symbol }} - {{ truncateAddress(t.address) }}
                  </option>
                </select>
              </div>

              <div class="bg-surface-2 p-4 rounded-lg border border-slate-700 shadow-sm">
                <label class="text-sm text-muted-foreground">Token 1 Address</label>
                <input v-model="createPairT1" type="text" placeholder="0x..."
                  class="mt-1 w-full px-3 py-2 border rounded-md border-slate-700 focus:ring-primary focus:border-amber-500 text-sm bg-surface-2 placeholder-slate-500" />
                <!-- Quick pick from history -->
                <select v-if="deployedTokens.length"
                  class="mt-2 w-full pl-3 pr-10 py-2 text-sm rounded-md border border-slate-700 bg-surface-2"
                  @change="(e: any) => (createPairT1 = e.target.value || createPairT1)">
                  <option value="">Pick from history…</option>
                  <option v-for="t in deployedTokens" :key="t.address" :value="t.address">
                    {{ t.symbol }} - {{ truncateAddress(t.address) }}
                  </option>
                </select>
              </div>
            </div>

            <div class="mt-4">
              <button @click="createPairFromInputs" class="w-full btn btn--primary"
                :disabled="!isConnected || pending.createPair">
                Create Pair
              </button>
              <p class="text-xs text-muted-foreground mt-2 text-center">
                We’ll validate both addresses are ERC-7984 before creating the pair.
              </p>
            </div>
          </div>

          <!-- Deployed Tokens (history) -->
          <div class="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-lg shadow-md border border-slate-700">
            <h2 class="text-lg font-medium text-primary mb-4">Deployed Tokens</h2>

            <div v-if="deployedTokens.length > 0" class="max-h-48 overflow-y-auto space-y-2 pr-1">
              <div v-for="(tok, idx) in deployedTokens.slice().reverse()" :key="idx"
                class="flex justify-between items-center bg-surface-2 p-3 rounded-md border border-slate-700 shadow-sm">
                <div>
                  <p class="text-sm font-medium text-slate-200">{{ tok.symbol }} - {{ tok.name }}</p>
                  <p class="text-xs text-muted-foreground">Deployed: {{ new Date(tok.timestamp).toLocaleString() }}</p>
                  <p class="text-xs text-primary-300 font-mono">Address: {{ tok.address }}</p>
                </div>
                <button @click="handleCopy(tok.address)" :class="[
                  'btn px-2 py-1 transition-colors',
                  copiedText === tok.address
                    ? 'bg-emerald-500 text-primary-foreground animate-pulse'
                    : 'bg-gradient-to-r from-primary-300 to-primary-200 text-primary-foreground hover:from-primary-400 hover:to-primary-300'
                ]">
                  {{ copiedText === tok.address ? 'Copied!' : 'Copy' }}
                </button>
              </div>
            </div>
            <div v-else class="text-sm text-muted-foreground">No tokens deployed yet.</div>

            <div class="mt-3">
              <button v-if="deployedTokens.length > 0" @click="clearDeployedTokens"
                class="px-3 py-2 text-xs bg-red-600 text-white rounded-md hover:bg-red-500 transition">
                Clear All
              </button>
            </div>
          </div>

          <!-- Created Pairs (history) -->
          <div class="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-lg shadow-md border border-slate-700">
            <h2 class="text-lg font-medium text-primary mb-4">Created Pairs</h2>

            <div v-if="createdPairs.length > 0" class="max-h-48 overflow-y-auto space-y-2 pr-1">
              <div v-for="(p, idx) in createdPairs.slice().reverse()" :key="idx"
                class="flex justify-between items-center bg-surface-2 p-3 rounded-md border border-slate-700 shadow-sm">
                <div class="min-w-0">
                  <p class="text-sm font-medium text-slate-200">
                    {{ p.symbol ? p.symbol : 'Pair' }} - {{ truncateAddress(p.address) }}
                  </p>
                  <p class="text-xs text-muted-foreground">
                    {{ new Date(p.timestamp).toLocaleString() }}
                  </p>
                  <p class="text-xs text-primary-300 font-mono truncate">
                    {{ truncateAddress(p.token0) }} / {{ truncateAddress(p.token1) }}
                  </p>
                </div>
                <button @click="handleCopy(p.address)" :class="[
                  'btn px-2 py-1 transition-colors',
                  copiedText === p.address
                    ? 'bg-emerald-500 text-primary-foreground animate-pulse'
                    : 'bg-gradient-to-r from-primary-300 to-primary-200 text-primary-foreground hover:from-primary-400 hover:to-primary-300'
                ]">
                  {{ copiedText === p.address ? 'Copied!' : 'Copy' }}
                </button>
              </div>
            </div>
            <div v-else class="text-sm text-muted-foreground">No pairs created yet.</div>

            <div class="mt-3">
              <button v-if="createdPairs.length > 0" @click="clearCreatedPairs"
                class="px-3 py-2 text-xs bg-red-600 text-white rounded-md hover:bg-red-500 transition">
                Clear All
              </button>
            </div>
          </div>

        </div>



      </div>

      <!-- Contract Addresses -->
      <div class="bg-gradient-to-r from-[#0c1118] to-[#0b0f15] p-4 border-t border-border">
        <div class="flex flex-wrap gap-2">
          <!-- Token 0 -->
          <div
            class="text-xs bg-surface-2 rounded-full px-3 py-1 shadow-sm border border-slate-700 flex items-center gap-2 cursor-pointer"
            @click="copyToClipboard(config.TOKEN0_ADDRESS)">
            <span class="font-semibold text-primary">{{ config.TOKEN0_SYMBOL }}:</span>
            <span class="font-mono text-slate-200">{{ truncateAddress(config.TOKEN0_ADDRESS) }}</span>
            <span v-if="copiedText === config.TOKEN0_ADDRESS" class="text-emerald-300 text-xs">Copied!</span>
            <svg v-else class="w-4 h-4 text-primary hover:text-primary-300 transition" fill="none" stroke="currentColor"
              stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M15 3H4a2 2 0 0 0-2 2v13"></path>
            </svg>
          </div>

          <!-- Token 1 -->
          <div
            class="text-xs bg-surface-2 rounded-full px-3 py-1 shadow-sm border border-slate-700 flex items-center gap-2 cursor-pointer"
            @click="copyToClipboard(config.TOKEN1_ADDRESS)">
            <span class="font-semibold text-primary">{{ config.TOKEN1_SYMBOL }}:</span>
            <span class="font-mono text-slate-200">{{ truncateAddress(config.TOKEN1_ADDRESS) }}</span>
            <span v-if="copiedText === config.TOKEN1_ADDRESS" class="text-emerald-300 text-xs">Copied!</span>
            <svg v-else class="w-4 h-4 text-primary hover:text-primary-300 transition" fill="none" stroke="currentColor"
              stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M15 3H4a2 2 0 0 0-2 2v13"></path>
            </svg>
          </div>

          <!-- Pair Address -->
          <div
            class="text-xs bg-surface-2 rounded-full px-3 py-1 shadow-sm border border-slate-700 flex items-center gap-2 cursor-pointer"
            @click="copyToClipboard(config.PAIR_ADDRESS)">
            <span class="font-semibold text-primary">Pair:</span>
            <span class="font-mono text-slate-200">{{ truncateAddress(config.PAIR_ADDRESS) }}</span>
            <span v-if="copiedText === config.PAIR_ADDRESS" class="text-emerald-300 text-xs">Copied!</span>
            <svg v-else class="w-4 h-4 text-primary hover:text-primary-300 transition" fill="none" stroke="currentColor"
              stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M15 3H4a2 2 0 0 0-2 2v13"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Loading Modal -->
  <div v-if="showLoading" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
    @click.self="closeLoadingModal" @keydown.esc="closeLoadingModal">
    <div class="bg-surface rounded-lg p-6 shadow-xl max-w-md w-full border border-slate-700 relative" role="dialog"
      aria-modal="true" aria-labelledby="loading-title" aria-describedby="loading-desc">
      <!-- Close (X) -->
      <button type="button" @click="closeLoadingModal"
        class="absolute top-3 right-3 z-10 inline-flex items-center justify-center rounded-md border border-slate-700 p-1.5 text-slate-300 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary"
        aria-label="Close">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div class="flex flex-col items-center">
        <!-- CAMM spinner -->
        <svg class="h-16 w-16 mb-4 text-primary" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true" role="img">
          <g class="spin-c" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round">
            <circle cx="32" cy="32" r="26" stroke-dasharray="109 55" />
          </g>
          <g fill="none" stroke="currentColor" stroke-width="1.25" stroke-linejoin="round">
            <polygon points="32,18 24,32 40,32" />
            <line x1="32" y1="18" x2="32" y2="32" />
            <polygon points="32,48 24,36 40,36" />
            <line x1="32" y1="36" x2="32" y2="48" />
          </g>
        </svg>

        <h3 id="loading-title" class="text-lg font-medium text-foreground mb-2">Processing Transaction</h3>
        <p id="loading-desc" class="text-muted-foreground text-center">
          {{ loadingMessage }}
        </p>

      </div>
    </div>
  </div>


  <!-- Success Modal -->
  <div v-if="showSuccess" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
    <div class="bg-surface rounded-lg p-6 shadow-xl max-w-md w-full border border-slate-700">
      <div class="flex flex-col items-center">
        <div
          class="rounded-full h-16 w-16 bg-emerald-900/30 flex items-center justify-center mb-4 border border-emerald-700">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-emerald-400" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-foreground mb-2">Success!</h3>
        <p class="text-muted-foreground text-center mb-4">
          {{ successMessage }}
        </p>
        <button @click="closeSuccessModal"
          class="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-surface transition-all duration-200">
          Close
        </button>
      </div>
    </div>
  </div>

  <!-- Error Modal -->
  <div v-if="showError" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
    <div class="bg-surface rounded-lg p-6 shadow-xl max-w-md w-full border border-slate-700">
      <div class="flex flex-col items-center">
        <div class="rounded-full h-16 w-16 bg-red-900/30 flex items-center justify-center mb-4 border border-red-700">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-red-400" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-foreground mb-2">Error</h3>
        <p class="text-muted-foreground text-center mb-4">
          {{ errorMessage }}
        </p>
        <button @click="closeErrorModal"
          class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-surface transition-all duration-200">
          Close
        </button>
      </div>
    </div>
  </div>

</template>

<script lang="ts" setup>
import { ref, onMounted, reactive, computed, watch } from 'vue'
import { BrowserProvider } from 'ethers';
import { ethers } from "ethers";
const SDK_URL = "https://cdn.zama.ai/relayer-sdk-js/0.2.0/relayer-sdk-js.js";
let initSDK: any;
let createInstance: any;
let SepoliaConfig: any;


import CAMM_ENV from "../CAMM.json";
import NETWORK_ENV from "../Network.json";
import ERC7984_ABI from "../contracts/ConfidentialToken.json";
import CAMMPAIR_ABI from "../contracts/CAMMPair.json";
import CAMMFACTORY_ABI from "../contracts/CAMMFactory.json";
import ORACLE_ABI from "../contracts/ObolPriceOracle.json";

// Types
interface Config {
  TOKEN0_ADDRESS: string;
  TOKEN1_ADDRESS: string;
  PAIR_ADDRESS: string;
  TOKEN0_SYMBOL: string;
  TOKEN1_SYMBOL: string;
  LPTOKEN_SYMBOL: string;
}

interface Tab {
  id: string;
  name: string;
}


interface Reserves {
  token0: number;
  token1: number;
}

// Network configuration
const REQUIRED_NETWORK = {
  chainId: NETWORK_ENV.public.CHAIN_ID,
  chainName: NETWORK_ENV.public.CHAIN_NAME,
  nativeCurrency: {
    name: NETWORK_ENV.public.CURRENCY_NAME,
    symbol: NETWORK_ENV.public.CURRENCY_SYMBOL,
    decimals: 18
  },
  rpcUrl: NETWORK_ENV.public.RPC_URL,
  blockExplorerUrl: NETWORK_ENV.public.EXPLORER_URL
};

const REQUIRED_CHAIN_ID_HEX = ('0x' + Number(REQUIRED_NETWORK.chainId).toString(16)).toLowerCase();

// Configuration
const config = ref<Config>({
  TOKEN0_ADDRESS: "",
  TOKEN1_ADDRESS: "",
  PAIR_ADDRESS: CAMM_ENV.DEFAULT_PAIR_ADDRESS,
  TOKEN0_SYMBOL: '--',
  TOKEN1_SYMBOL: '--',
  LPTOKEN_SYMBOL: '--'
})

const STORAGE_KEY = "CAMM_DECRYPTION_REQUESTS";

interface DecryptionRequest {
  requestId: string;
  type: string;
  blockNumber: string;
  pairAddress?: string;
  timestamp: number;
}


const searchToken0Input = ref<string>("")
const searchToken1Input = ref<string>("")
const searchedPair = ref<string>("")
const pairNotFound = ref<boolean>(false)
const priceNote = ref<string>("");


const selectRecommendedPair = () => {
  pairNotFound.value = false
  showSuccessModal(`Using recommended pair: ${config.value.TOKEN0_SYMBOL}/${config.value.TOKEN1_SYMBOL}`)
}
// Tabs
const tabs: Tab[] = [
  { id: 'pair', name: 'Pair Selection' },
  { id: 'swap', name: 'Swap' },
  { id: 'token', name: 'Tokens' },
  { id: 'amm', name: 'AMM' },
  { id: 'launch', name: 'Launch' },
]
const activeTab = ref<string>('pair')
const searchPairAddrInput = ref<string>("");

let fhevmInstance: any;
const provider = window.ethereum ? new BrowserProvider(window.ethereum) : null;
const tokenFactor = BigInt(10) ** BigInt(6);

const CAMM_GITHUB_URL: string = CAMM_ENV.BACKEND_GITHUB_URL;
const CAMM_FRONT_GITHUB_URL: string = CAMM_ENV.FRONTEND_GITHUB_URL;

// Loading Modal State
const pending = reactive({
  swap: false,
  addLiquidity: false,
  removeLiquidity: false,
  balances: false,
  reserves: false,
  airdrop: false,
  transfer: false,
  operator: false,
  refund: false,
  deployToken: false,
  createPair: false,
  fetchPrice: false,
  searchPair: false,
  searchPairByAddr: false,
  selfDecryptPrice: false,
  lpBalance: false,
  metamask: false,
})
const loadingMessage = ref<string>("Please wait while your transaction is being processed...");

// POC modal state
const POC_ACK_KEY = 'CAMM_POC_ACK';
const showPOCModal = ref<boolean>(false);
const dontShowAgain = ref<boolean>(false);

// Token tab state
const token0Balance = ref<number>(0)
const token1Balance = ref<number>(0)
const T0T1Rate = ref<number>(0) // Default value
const tokenAirdrop = ref<string>(config.value.TOKEN0_SYMBOL)
const transferToken = ref<string>(config.value.TOKEN0_SYMBOL)
const transferRecipient = ref<string>('')
const transferAmount = ref<number>(0)
const operatorToken = ref<string>(config.value.TOKEN0_SYMBOL)
const operatorAddress = ref<string>('')

// AMM tab state
const lpBalance = ref<number>(0)
const reserves = reactive<Reserves>({
  token0: 0,
  token1: 0
})
const addLiquidityAmount0 = ref<number>(0)
const addLiquidityAmount1 = ref<number>(0)
const removeLiquidityAmount = ref<number>(0)

// MetaMask connection state
const isMetaMaskInstalled = ref<boolean>(false)
const isConnected = ref<boolean>(false)
const account = ref<string>('')
const chainId = ref<string>('')
const isWrongNetwork = computed(() => {
  return isMetaMaskInstalled.value && !!chainId.value && chainId.value.toLowerCase() !== REQUIRED_CHAIN_ID_HEX;
});


// Swap tab state
const fromCurrency = ref<string>(config.value.TOKEN0_SYMBOL);
const toCurrency = ref<string>(config.value.TOKEN1_SYMBOL);
const fromAmount = ref<number>(0)
const toAmount = ref<number>(0)
const swapRate = ref<number>(0) // Default value

// Transaction state
const showSuccess = ref<boolean>(false)
const successMessage = ref<string>('')

const showError = ref<boolean>(false)
const errorMessage = ref<string>('')

const copiedText = ref<string>('');

const storedRequests = ref(getDecryptionRequests());

type RefundType = 'swap' | 'add' | 'remove';

const selectedRefundType = ref<RefundType>('swap'); // default
const refundRequestId = ref<number | null>(null);

const isValidRefundId = computed(() =>
  typeof refundRequestId.value === 'number' &&
  Number.isFinite(refundRequestId.value!) &&
  refundRequestId.value! >= 0
);

const refundButtonLabel = computed(() => {
  switch (selectedRefundType.value) {
    case 'add': return 'Claim Add-Liquidity Refund';
    case 'remove': return 'Claim Remove-Liquidity Refund';
    default: return 'Claim Swap Refund';
  }
});

const showLoading = ref(false);

function closeLoadingModal() {
  showLoading.value = false;
}


// ===== Launch tab state =====
const deployedTokens = ref<DeployedToken[]>(readTokenHistory());
const createdPairs = ref<CreatedPair[]>(readPairHistory());

const newTokenName = ref<string>('');
const newTokenSymbol = ref<string>('');

// For "Create Pair"
const createPairT0 = ref<string>(''); // token0 address input
const createPairT1 = ref<string>(''); // token1 address input

// Deployed token history (localStorage like Decryption Requests)
interface DeployedToken {
  address: string;
  name: string;
  symbol: string;
  timestamp: number;
}
const TOKENS_KEY = "CAMM_DEPLOYED_TOKENS";

interface CreatedPair {
  address: string;
  token0: string;
  token1: string;
  symbol?: string;
  timestamp: number;
}
const PAIRS_KEY = "CAMM_CREATED_PAIRS";

function maybeShowPOCModal() {
  // Only show once the app area is reachable (after MetaMask+Network checks)
  if (localStorage.getItem(POC_ACK_KEY) === '1') return;
  if (isMetaMaskInstalled.value && !isWrongNetwork.value) {
    showPOCModal.value = true;
  }
}

function closePOCModal() {
  showPOCModal.value = false;
}

function confirmPOCModal() {
  if (dontShowAgain.value) {
    try { localStorage.setItem(POC_ACK_KEY, '1'); } catch { }
  }
  showPOCModal.value = false;
}


watch([isMetaMaskInstalled, isWrongNetwork], () => {
  if (!isWrongNetwork.value && isMetaMaskInstalled.value) {
    maybeShowPOCModal();
  }
});

function readPairHistory(): CreatedPair[] {
  try {
    const raw = localStorage.getItem(PAIRS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
function writePairHistory(list: CreatedPair[]) {
  try { localStorage.setItem(PAIRS_KEY, JSON.stringify(list)); } catch { }
}

async function addPairToHistory(pairAddr: string) {
  try {
    const signer = provider ? await provider.getSigner() : null;
    if (!signer) throw new Error("No wallet connected.");

    const pair = new ethers.Contract(pairAddr, CAMMPAIR_ABI.abi, signer);
    const t0 = await pair.token0Address();
    const t1 = await pair.token1Address();
    let sym = "";
    try { sym = await pair.symbol(); } catch {/* optional */ }

    const list = readPairHistory();
    list.push({ address: pairAddr, token0: t0, token1: t1, symbol: sym, timestamp: Date.now() });
    writePairHistory(list);
    createdPairs.value = list.slice();
  } catch (e) {
    console.error("Failed to add pair to history:", e);
  }
}
function clearCreatedPairs() {
  localStorage.removeItem(PAIRS_KEY);
  createdPairs.value = [];
}

function readTokenHistory(): DeployedToken[] {
  try {
    const raw = localStorage.getItem(TOKENS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
function writeTokenHistory(list: DeployedToken[]) {
  try { localStorage.setItem(TOKENS_KEY, JSON.stringify(list)); } catch { }
}
function addDeployedTokenToHistory(addr: string, name: string, symbol: string) {
  const list = readTokenHistory();
  list.push({ address: addr, name, symbol, timestamp: Date.now() });
  writeTokenHistory(list);
  deployedTokens.value = list.slice(); // refresh
}
function clearDeployedTokens() {
  localStorage.removeItem(TOKENS_KEY);
  deployedTokens.value = [];
}

function normalizeReq(req: DecryptionRequest): DecryptionRequest {
  return {
    ...req,
    requestId: (req.requestId ?? '').toString().trim(),
    pairAddress: req.pairAddress ? req.pairAddress.toLowerCase() : undefined,
  };
}

function dedupeRequests(list: DecryptionRequest[]): DecryptionRequest[] {
  const map = new Map<string, DecryptionRequest>();
  for (const raw of list) {
    const req = normalizeReq(raw);
    const key = `${req.pairAddress ?? ''}|${req.requestId}`;
    const prev = map.get(key);
    if (!prev || (req.timestamp ?? 0) > (prev.timestamp ?? 0)) {
      map.set(key, req);
    }
  }
  return Array.from(map.values()).sort((a, b) => (b.timestamp ?? 0) - (a.timestamp ?? 0));
}

function deduplicateDecryptionRequests(): void {
  const cleaned = dedupeRequests(getStorage());
  saveStorage(cleaned);
  storedRequests.value = cleaned;
}

function addDecryptionRequest(type: string, blockNumber: number, requestId: string, pairAddress: string) {
  saveDecryptionRequest(type, blockNumber, requestId, pairAddress);
  storedRequests.value = getDecryptionRequests();
}

function getStorage(): DecryptionRequest[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const list = raw ? JSON.parse(raw) as DecryptionRequest[] : [];
    return dedupeRequests(list);
  } catch (err) {
    console.error("Error parsing storage:", err);
    return [];
  }
}

function saveStorage(data: DecryptionRequest[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dedupeRequests(data)));
  } catch (err) {
    console.error("Error saving storage:", err);
  }
}

function saveDecryptionRequest(type: string, blockNumber: any, requestId: any, pairAddress: string): void {
  const storage = getStorage();
  storage.push({
    requestId: requestId?.toString().trim(),
    type,
    blockNumber: blockNumber?.toString(),
    pairAddress: pairAddress?.toLowerCase(),
    timestamp: Date.now(),
  });
  saveStorage(storage);
}
function getDecryptionRequests(): DecryptionRequest[] {
  return getStorage();
}

function clearDecryptionRequests(): void {
  localStorage.removeItem(STORAGE_KEY);
  storedRequests.value = [];
}

function handleCopy(text: string) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "absolute";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);

  textarea.select();
  try {
    document.execCommand("copy");
    copiedText.value = text;

    // Reset after 2s
    setTimeout(() => {
      copiedText.value = "";
    }, 2000);
  } catch (err) {
    console.error("Clipboard copy failed:", err);
    showErrorModal("Failed to copy to clipboard.");
  }

  document.body.removeChild(textarea);
};

async function searchPairByAddress() {
  const addr = searchPairAddrInput.value.trim();
  if (!isValidAddress(addr)) {
    return showErrorModal('Please enter a valid pair address (0x…40 hex).');
  }

  try {
    pending.searchPairByAddr = true;
    loadingMessage.value = "Searching for pair...";
    showLoading.value = true;
    const signer = provider ? await provider.getSigner() : null;
    if (!signer) return showErrorModal('No wallet connected. Please connect MetaMask.');

    const pair = new ethers.Contract(addr, CAMMPAIR_ABI.abi, signer);

    config.value.PAIR_ADDRESS = await pair.getAddress();

    // This fetches symbols & sets TOKEN0/1 addresses internally
    await fetchTokenSymbols();
    await fetchPrice();

    showSuccessModal(`Loaded pair at ${addr}`);
    searchedPair.value = addr;
    pairNotFound.value = false;
  } catch (e) {
    console.error("searchPairByAddress error:", e);
    pairNotFound.value = true;
    searchedPair.value = "";
    showErrorModal('Could not load this pair address.');
  }
  finally {
    pending.searchPairByAddr = false;
    showLoading.value = false;
  }
}

// Function to copy text to clipboard using old api for unsafe env (http).
const copyToClipboard = (text: string) => {
  // Create a temporary <textarea> element
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "absolute";
  textarea.style.left = "-9999px"; // Move it off-screen to keep it invisible
  document.body.appendChild(textarea);

  // Select and copy the text
  textarea.select();
  try {
    document.execCommand("copy"); // Old browser-compatible method
    copiedText.value = text;
    setTimeout(() => {
      copiedText.value = "";
    }, 2000);
  } catch (err) {
    console.error("Fallback clipboard copy failed:", err);
    showErrorModal("Failed to copy to clipboard.");
  }

  // Remove the textarea from the DOM
  document.body.removeChild(textarea);
};

// Function to refresh the page
const refreshPage = () => {
  window.location.reload();
};

async function reencryption(CONTRACT_ADDRESS: any, USER_ADDRESS: any, encrypted_value: any) {
  const signer = provider ? await provider.getSigner() : null;
  if (!signer) {
    showErrorModal('No wallet connected. Please connect MetaMask.');
    return;
  }

  const keypair = fhevmInstance.generateKeypair();
  const handleContractPairs = [
    {
      handle: encrypted_value,
      contractAddress: CONTRACT_ADDRESS,
    },
  ];
  const startTimeStamp = Math.floor(Date.now() / 1000).toString();
  const durationDays = "10";
  const contractAddresses = [CONTRACT_ADDRESS];

  const eip712 = fhevmInstance.createEIP712(keypair.publicKey, contractAddresses, startTimeStamp, durationDays);

  const signature = await signer.signTypedData(
    eip712.domain,
    {
      UserDecryptRequestVerification: eip712.types.UserDecryptRequestVerification,
    },
    eip712.message,
  );

  const result = await fhevmInstance.userDecrypt(
    handleContractPairs,
    keypair.privateKey,
    keypair.publicKey,
    signature.replace("0x", ""),
    contractAddresses,
    await signer.getAddress(),
    startTimeStamp,
    durationDays,
  );

  const decryptedValue = result[encrypted_value];
  return decryptedValue;
};

// Token tab functions
const getBalances = async (): Promise<void> => {
  if (!isConnected.value) {
    showErrorModal('Please connect your wallet first')
    return
  }

  pending.balances = true
  loadingMessage.value = "Fetching confidential balances...";
  showLoading.value = true;

  try {
    console.log('Getting balances...');

    const signer = provider ? await provider.getSigner() : null;
    if (!signer) {
      showErrorModal('No wallet connected. Please connect MetaMask.');
      return;
    }

    const token0Instance = new ethers.Contract(config.value.TOKEN0_ADDRESS, ERC7984_ABI.abi, signer);
    const token1Instance = new ethers.Contract(config.value.TOKEN1_ADDRESS, ERC7984_ABI.abi, signer);

    const encryptedBalance0 = await token0Instance.confidentialBalanceOf(await signer.getAddress());
    const encryptedBalance1 = await token1Instance.confidentialBalanceOf(await signer.getAddress());

    console.log("Encrypted Balances :", encryptedBalance0, encryptedBalance1)
    if (encryptedBalance0 == 0) {
      token0Balance.value = 0;
    }
    else {
      loadingMessage.value = `Decrypting ${config.value.TOKEN0_SYMBOL} balance...`;
      const clearBalance0 = await reencryption(config.value.TOKEN0_ADDRESS, await signer.getAddress(), encryptedBalance0);
      token0Balance.value = parseInt(ethers.formatUnits(clearBalance0, 6));
      console.log("Decrypted balance 0 :", clearBalance0);
    }

    if (encryptedBalance1 == 0) {
      token1Balance.value = 0;
    }
    else {
      loadingMessage.value = `Decrypting ${config.value.TOKEN1_SYMBOL} balance...`;
      const clearBalance1 = await reencryption(config.value.TOKEN1_ADDRESS, await signer.getAddress(), encryptedBalance1);
      token1Balance.value = parseInt(ethers.formatUnits(clearBalance1, 6));
      console.log("Decrypted balance 1 :", clearBalance1);
    }

    showSuccessModal('Balances updated successfully!')
  }
  catch (error) {
    console.error('Error getting balances:', error)
    showErrorModal('Failed to get balances')
  } finally {
    pending.balances = false;
    showLoading.value = false;
  }
}

async function fetchPrice() {

  // const res = await fetch(`/api/price-approx?pair=${config.value.PAIR_ADDRESS}`)

  // if (!res.ok) {
  //   console.log(res)
  //   throw new Error(`API error: ${res.status}`)
  // }
  // const data = await res.json();
  // console.log("Price data from API :", data);

  // T0T1Rate.value = parseFloat(data.priceToken0Token1);

  // // Update swap rate
  // swapRate.value = fromCurrency.value == config.value.TOKEN0_SYMBOL ? T0T1Rate.value : 1 / T0T1Rate.value

  try {
    priceNote.value = "";

    const isDefaultPair =
      (config.value.PAIR_ADDRESS || "").toLowerCase() ===
      (CAMM_ENV.DEFAULT_PAIR_ADDRESS || "").toLowerCase();

    const oracleAddr = (CAMM_ENV.DEFAULT_ORACLE_ADDRESS || "").toLowerCase();
    const hasOracle =
      isDefaultPair &&
      oracleAddr &&
      oracleAddr !== ethers.ZeroAddress.toLowerCase();

    // Heuristics to identify EUR / USD by symbol
    const isEUR = (s: string) => {
      const u = (s || "").toUpperCase();
      return u === "EUR" || u.startsWith("EUR") || u.endsWith("EUR") || u.includes(" EUR");
    };
    const isUSD = (s: string) => {
      const u = (s || "").toUpperCase();
      return u === "USD" || u.startsWith("USD") || u.endsWith("USD") || u.includes(" USD");
    };

    if (hasOracle) {
      const signer = provider ? await provider.getSigner() : null;
      if (!signer) throw new Error("No wallet connected.");

      const oracle = new ethers.Contract(oracleAddr, ORACLE_ABI.abi ?? ORACLE_ABI, signer);
      const price6 = await oracle.price6(); // EUR per 1 USD, scaled 1e6
      const eurPerUsd = Number(price6) / 1_000_000;

      const s0 = (config.value.TOKEN0_SYMBOL || "").toUpperCase();
      const s1 = (config.value.TOKEN1_SYMBOL || "").toUpperCase();

      // T0T1Rate must be "token1 per 1 token0"
      let rate: number | null = null;
      if (isEUR(s0) && isUSD(s1)) {
        // Want USD per 1 EUR  =>  1 / (EUR per 1 USD)
        rate = eurPerUsd > 0 ? 1 / eurPerUsd : 0;
      } else if (isUSD(s0) && isEUR(s1)) {
        // Want EUR per 1 USD  =>  EUR per 1 USD (as-is)
        rate = eurPerUsd;
      }

      if (rate && rate > 0) {
        T0T1Rate.value = rate;
        swapRate.value =
          fromCurrency.value === config.value.TOKEN0_SYMBOL
            ? T0T1Rate.value
            : 1 / T0T1Rate.value;
        priceNote.value = "oracle";
        return;
      }

      // If symbols are not EUR/USD, fall back to self-decrypt
    }

    // Fallback / non-default pair: self-decrypt from reserves
    await requestPriceInfo();
    priceNote.value = "self-decrypted";
  } catch (e) {
    console.error("fetchPrice error:", e);
    // As a last resort, try self-decrypt as well
    try {
      await requestPriceInfo();
      priceNote.value = "self-decrypted";
    } catch {
      // keep previous values if any
    }
  }
}

async function updateSwapPrice() {
  try {
    pending.fetchPrice = true
    loadingMessage.value = "Fetching latest price from API...";
    showLoading.value = true;
    await fetchPrice();
    showSuccessModal(`${config.value.TOKEN0_SYMBOL}/${config.value.TOKEN1_SYMBOL} rate updated successfully!`);
  } catch (error) {
    console.error('Error fetching price from API:', error);
  } finally {
    pending.fetchPrice = false
    showLoading.value = false;
  }
}

const claimAirdrop = async (): Promise<void> => {
  if (!isConnected.value) {
    showErrorModal('Please connect your wallet first')
    return
  }

  const signer = provider ? await provider.getSigner() : null;
  if (!signer) {
    showErrorModal('No wallet connected. Please connect MetaMask.');
    return;
  }

  pending.airdrop = true
  loadingMessage.value = "Preparing AirDrop transaction...";
  showLoading.value = true;

  let sourceToken;
  if (tokenAirdrop.value == config.value.TOKEN0_SYMBOL) {
    sourceToken = new ethers.Contract(config.value.TOKEN0_ADDRESS, ERC7984_ABI.abi, signer);
  } else {
    sourceToken = new ethers.Contract(config.value.TOKEN1_ADDRESS, ERC7984_ABI.abi, signer);
  }

  try {
    console.log(`Claiming ${tokenAirdrop.value} AirDrop`)
    const airdropTx = await sourceToken.airDrop();
    loadingMessage.value = "Waiting for AirDrop transaction confirmation...";
    const receipt = await airdropTx.wait();

    console.log("Airdrop TX status:", receipt.status);

    if (!receipt.status) {
      throw ("Airdrop TX failed");
    }

    showSuccessModal(`Successfully claimed ${tokenAirdrop.value} airdrop !`)
  } catch (error) {
    console.error('Error while claiming airdrop:', error);
    showErrorModal("Error while claiming airdrop");
  } finally {
    pending.airdrop = false;
    showLoading.value = false;
  }
}

const transferTokens = async (): Promise<void> => {
  if (!isConnected.value) {
    showErrorModal('Please connect your wallet first')
    return
  }

  if (!transferRecipient.value.startsWith('0x') || transferRecipient.value.length !== 42) {
    showErrorModal('Please enter a valid Ethereum address')
    return
  }

  pending.transfer = true
  loadingMessage.value = "Preparing transfer transaction...";
  showLoading.value = true;

  const signer = provider ? await provider.getSigner() : null;
  if (!signer) {
    showErrorModal('No wallet connected. Please connect MetaMask.');
    return;
  }

  try {
    console.log(`Transferring ${transferAmount.value} ${transferToken.value} to ${transferRecipient.value}`)
    let sourceToken;
    if (transferToken.value == config.value.TOKEN0_SYMBOL) {
      sourceToken = new ethers.Contract(config.value.TOKEN0_ADDRESS, ERC7984_ABI.abi, signer);
    }
    else {
      sourceToken = new ethers.Contract(config.value.TOKEN1_ADDRESS, ERC7984_ABI.abi, signer);
    }

    const buffer = fhevmInstance.createEncryptedInput(await sourceToken.getAddress(), await signer.getAddress());
    buffer.add64(BigInt(transferAmount.value) * tokenFactor);
    const ciphertexts = await buffer.encrypt();

    const transferTx = await sourceToken["confidentialTransfer(address,bytes32,bytes)"](
      transferRecipient.value,
      ciphertexts.handles[0],
      ciphertexts.inputProof,
    );
    loadingMessage.value = "Waiting for transfer transaction confirmation...";

    const receipt = await transferTx.wait();
    console.log("Token transfer status:", receipt.status);

    if (!receipt.status) {
      showErrorModal("Error while transfering tokens");
      pending.transfer = false
      showLoading.value = false;
      return;
    }

    showSuccessModal(`Successfully transferred ${transferAmount.value} ${transferToken.value} to ${truncateAddress(transferRecipient.value)}!`)
    transferAmount.value = 0
    transferRecipient.value = ''
  } catch (error) {
    console.error('Error transferring tokens:', error)
    showErrorModal('Failed to transfer tokens')
  } finally {
    pending.transfer = false;
    showLoading.value = false;
  }
}

async function setOperator() {
  if (!isConnected.value) {
    showErrorModal('Please connect your wallet first')
    return
  }

  if (!operatorAddress.value.startsWith('0x') || operatorAddress.value.length !== 42) {
    showErrorModal('Please enter a valid Ethereum address')
    return
  }

  const signer = provider ? await provider.getSigner() : null;
  if (!signer) {
    showErrorModal('No wallet connected. Please connect MetaMask.');
    return;
  }

  pending.operator = true
  loadingMessage.value = "Preparing setOperator transaction...";
  showLoading.value = true;

  try {
    console.log(`Setting ${operatorAddress.value} as an operator on ${operatorToken.value}.`);

    let sourceToken;
    if (operatorToken.value == config.value.TOKEN0_SYMBOL) {
      sourceToken = new ethers.Contract(config.value.TOKEN0_ADDRESS, ERC7984_ABI.abi, signer);
    } else if (operatorToken.value == config.value.TOKEN1_SYMBOL) {
      sourceToken = new ethers.Contract(config.value.TOKEN1_ADDRESS, ERC7984_ABI.abi, signer);
    } else if (operatorToken.value === config.value.LPTOKEN_SYMBOL) {
      sourceToken = new ethers.Contract(config.value.PAIR_ADDRESS, CAMMPAIR_ABI.abi, signer);
    } else {
      throw new Error("Invalid value selected");
    }

    const currentBlock = await signer.provider!.getBlock("latest");
    if (!currentBlock) {
      throw new Error("Could not retrieve last block.");
    }

    const blockTimestamp = currentBlock.timestamp;
    const targetTimestamp = blockTimestamp + 600; // 10 minutes from now

    const setOperatorTx = await sourceToken.setOperator(
      operatorAddress.value,
      targetTimestamp
    );

    loadingMessage.value = "Waiting for setOperator transaction confirmation...";

    const receiptSetOperator = await setOperatorTx.wait();
    console.log("SetOperator status:", receiptSetOperator.status);
    if (!receiptSetOperator.status) {
      throw new Error("Error while setting operator");
    }

    showSuccessModal(`Successfully set ${truncateAddress(operatorAddress.value)} as an operator on ${operatorToken.value} !`)
    operatorAddress.value = ''
  } catch (error) {
    console.error('Error while setting an operator :', error)
    showErrorModal(`Failed to set ${truncateAddress(operatorAddress.value)} as an operator on ${operatorToken.value}`);
  } finally {
    pending.operator = false;
    showLoading.value = false;
  }
}

// AMM tab functions
async function getLPBalance() {
  if (!isConnected.value) {
    showErrorModal('Please connect your wallet first')
    return
  }

  pending.lpBalance = true
  loadingMessage.value = "Fetching LP balance...";
  showLoading.value = true;

  try {
    console.log('Getting LP balance...')

    const signer = provider ? await provider.getSigner() : null;
    if (!signer) {
      showErrorModal('No wallet connected. Please connect MetaMask.');
      return;
    }

    const pairInstance = new ethers.Contract(config.value.PAIR_ADDRESS, CAMMPAIR_ABI.abi, signer);

    const encryptedLPBalance = await pairInstance.confidentialBalanceOf(await signer.getAddress());

    console.log("Encrypted LP Balance:", encryptedLPBalance);
    if (encryptedLPBalance == 0) {
      lpBalance.value = 0;
    }
    else {
      loadingMessage.value = "Decrypting LPBalance...";
      const clearLPBalance = await reencryption(config.value.PAIR_ADDRESS, await signer.getAddress(), encryptedLPBalance);
      lpBalance.value = parseInt(ethers.formatUnits(clearLPBalance, 6));
      console.log("Decrypted LP balance:", clearLPBalance);
    }

    showSuccessModal('LP balance updated successfully!')
  } catch (error) {
    console.error('Error getting LP balance:', error)
    showErrorModal('Failed to get LP balance')
  } finally {
    pending.lpBalance = false;
    showLoading.value = false;
  }
}

async function decryptObfuscatedReserves(encryptedReserve0: any, encryptedReserve1: any) {

  const handles = [];
  if (encryptedReserve0 !== ethers.ZeroHash) handles.push(encryptedReserve0);
  if (encryptedReserve1 !== ethers.ZeroHash) handles.push(encryptedReserve1);

  if (handles.length === 0) {
    return [BigInt(0), BigInt(0)];
  }
  const values = await fhevmInstance.publicDecrypt(handles);

  console.log("Decrypted reserves values:", values);
  return [values[encryptedReserve0], values[encryptedReserve1]];
};

async function getPairReserves() {

  try {
    console.log('Getting pair reserves...')
    const signer = provider ? await provider.getSigner() : null;
    if (!signer) {
      showErrorModal('No wallet connected. Please connect MetaMask.');
      return;
    }

    pending.reserves = true;
    loadingMessage.value = "Getting obfuscated reserves info...";
    showLoading.value = true;

    const pairInstance = new ethers.Contract(config.value.PAIR_ADDRESS, CAMMPAIR_ABI.abi, signer);

    const obfusctaedReserves = await pairInstance.obfuscatedReserves();
    const encryptedReserve0 = obfusctaedReserves[0];
    const encryptedReserve1 = obfusctaedReserves[1];

    console.log("Got encrypted reserves:", encryptedReserve0, encryptedReserve1);

    loadingMessage.value = "Decrypting reserves...";
    const obfuscatedReserves = await decryptObfuscatedReserves(encryptedReserve0, encryptedReserve1);

    if (!obfuscatedReserves) {
      throw new Error("Failed to decrypt reserves.");
    }

    reserves.token0 = parseInt(ethers.formatUnits(obfuscatedReserves[0], 6));
    reserves.token1 = parseInt(ethers.formatUnits(obfuscatedReserves[1], 6));


    showSuccessModal('Obfuscated reserves updated successfully!')
  } catch (error) {
    console.error('Error getting pair reserves:', error)
    showErrorModal('Failed to get pair reserves')
  } finally {
    pending.reserves = false;
    showLoading.value = false;
  }
}

async function requestPriceInfo() {
  await getPairReserves();
  T0T1Rate.value = parseFloat(reserves.token1.toString()) / parseFloat(reserves.token0.toString());

  // Update swap rate
  swapRate.value = fromCurrency.value == config.value.TOKEN0_SYMBOL ? T0T1Rate.value : 1 / T0T1Rate.value

}

async function addLiquidity() {
  if (!isConnected.value) {
    showErrorModal('Please connect your wallet first')
    return
  }

  try {
    console.log(`Adding liquidity: ${addLiquidityAmount0.value} ${config.value.TOKEN0_SYMBOL} and ${addLiquidityAmount1.value} ${config.value.TOKEN1_SYMBOL}`)
    const signer = provider ? await provider.getSigner() : null;
    if (!signer) {
      showErrorModal('No wallet connected. Please connect MetaMask.');
      return;
    }
    pending.addLiquidity = true
    loadingMessage.value = "Checking operator status...";
    showLoading.value = true;

    const token0Instance = new ethers.Contract(config.value.TOKEN0_ADDRESS, ERC7984_ABI.abi, signer);
    const token1Instance = new ethers.Contract(config.value.TOKEN1_ADDRESS, ERC7984_ABI.abi, signer);

    const isOperator0 = await token0Instance.isOperator(await signer.getAddress(), config.value.PAIR_ADDRESS);
    const isOperator1 = await token1Instance.isOperator(await signer.getAddress(), config.value.PAIR_ADDRESS);
    if (!isOperator0) {
      showErrorModal(`Please set the pair contract as an operator on ${config.value.TOKEN0_SYMBOL} first.`);
      return;
    }
    if (!isOperator1) {
      showErrorModal(`Please set the pair contract as an operator on ${config.value.TOKEN1_SYMBOL} first.`);
      return;
    }

    loadingMessage.value = "Preparing add liquidity transaction...";
    const pairInstance = new ethers.Contract(config.value.PAIR_ADDRESS, CAMMPAIR_ABI.abi, signer);

    const buffer = fhevmInstance.createEncryptedInput(await pairInstance.getAddress(), await signer.getAddress());
    buffer.add64(BigInt(addLiquidityAmount0.value) * tokenFactor);
    buffer.add64(BigInt(addLiquidityAmount1.value) * tokenFactor);
    const ciphertexts = await buffer.encrypt();

    const block = await provider?.getBlock("latest");
    if (!block) throw new Error("Failed to fetch latest block.");
    const blockTimestamp = block.timestamp;

    const decEventPromise = waitForEventOnce(pairInstance, "decryptionRequested", { fromBlock: block.number });

    loadingMessage.value = "Waiting for add liquidity transaction to be mined...";
    const liqTx = await pairInstance["addLiquidity(bytes32,bytes32,uint256,bytes)"](
      ciphertexts.handles[0],
      ciphertexts.handles[1],
      blockTimestamp + 1000,
      ciphertexts.inputProof,
    );

    const liqReceipt = await liqTx.wait();
    console.log("Add liquidity status:", liqReceipt?.status);
    if (!liqReceipt?.status) {
      throw new Error("addLiquidity tx failed.");
    }

    const decryptionRequestEvent = await decEventPromise;
    const requestBlockNumber = decryptionRequestEvent.args[1];
    const requestID = decryptionRequestEvent.args[2];
    addDecryptionRequest("Add Liquidity", requestBlockNumber, requestID.toString(), config.value.PAIR_ADDRESS);

    const liqEventPromise = waitForEventOnce(pairInstance, "liquidityMinted", { fromBlock: block.number });
    console.log("Waiting for liquidity minted event (gateway response).");
    loadingMessage.value = "Waiting for liquidity minted event (gateway response)...";
    await liqEventPromise;

    showSuccessModal(`Successfully added liquidity: ${addLiquidityAmount0.value} ${config.value.TOKEN0_SYMBOL} and ${addLiquidityAmount1.value} ${config.value.TOKEN1_SYMBOL}!`)
    addLiquidityAmount0.value = 0
    addLiquidityAmount1.value = 0
  } catch (error) {
    console.error('Error adding liquidity:', error)
    showErrorModal('Failed to add liquidity')
  } finally {
    pending.addLiquidity = false;
    showLoading.value = false;
  }
}

async function removeLiquidity() {
  if (!isConnected.value) {
    showErrorModal('Please connect your wallet first')
    return
  }

  try {
    console.log(`Removing liquidity: ${removeLiquidityAmount.value} ${config.value.LPTOKEN_SYMBOL}`)
    const signer = provider ? await provider.getSigner() : null;
    if (!signer) {
      showErrorModal('No wallet connected. Please connect MetaMask.');
      return;
    }
    pending.removeLiquidity = true
    loadingMessage.value = "Checking operator status...";
    showLoading.value = true;

    const pairInstance = new ethers.Contract(config.value.PAIR_ADDRESS, CAMMPAIR_ABI.abi, signer);


    const isOperator = await pairInstance.isOperator(await signer.getAddress(), config.value.PAIR_ADDRESS);
    if (!isOperator) {
      showErrorModal(`Please set the pair contract as an operator on ${config.value.LPTOKEN_SYMBOL} first.`);
      return;
    }

    loadingMessage.value = "Preparing remove liquidity transaction...";

    const buffer = fhevmInstance.createEncryptedInput(await pairInstance.getAddress(), await signer.getAddress());
    buffer.add64(BigInt(removeLiquidityAmount.value) * tokenFactor);
    const ciphertexts = await buffer.encrypt();

    const block = await provider?.getBlock("latest");
    if (!block) throw new Error("Failed to fetch latest block.");
    const blockTimestamp = block.timestamp;

    const anchorBlock = await provider!.getBlockNumber();
    const decEventPromise = waitForEventOnce(pairInstance, "decryptionRequested", { fromBlock: anchorBlock });
    const liqEventPromise = waitForEventOnce(pairInstance, "liquidityBurnt", { fromBlock: anchorBlock });

    loadingMessage.value = "Waiting for remove liquidity transaction to be mined...";

    const removeLiqTx = await pairInstance["removeLiquidity(bytes32,address,uint256,bytes)"](
      ciphertexts.handles[0],
      await signer.getAddress(),
      blockTimestamp + 1000,
      ciphertexts.inputProof,
    );

    const removeLiqReceipt = await removeLiqTx.wait();
    console.log("Remove liquidity status:", removeLiqReceipt?.status);
    if (!removeLiqReceipt?.status) {
      throw new Error("removeLiquidity tx failed.");
    }

    const dec = await decEventPromise;
    addDecryptionRequest("Remove Liquidity", Number(dec.args[1]), String(dec.args[2]), config.value.PAIR_ADDRESS);


    console.log("Waiting for liquidity burnt event (gateway response).");
    loadingMessage.value = "Waiting for liquidity burnt event (gateway response)...";
    await liqEventPromise;

    showSuccessModal(`Successfully removed liquidity: ${removeLiquidityAmount.value} ${config.value.LPTOKEN_SYMBOL} !`)
    removeLiquidityAmount.value = 0
  } catch (error) {
    console.error('Error removing liquidity:', error)
    showErrorModal('Failed to remove liquidity')
  } finally {
    pending.removeLiquidity = false;
    showLoading.value = false;
  }
}
async function submitRefund() {
  if (!isConnected.value) return showErrorModal('Please connect your wallet first');
  if (!isValidRefundId.value) return showErrorModal('Enter a valid requestID');

  try {
    const signer = provider ? await provider.getSigner() : null;
    if (!signer) return showErrorModal('No wallet connected. Please connect MetaMask.');

    pending.refund = true;
    loadingMessage.value = "Preparing refund transaction...";
    showLoading.value = true;

    const pair = new ethers.Contract(config.value.PAIR_ADDRESS, CAMMPAIR_ABI.abi, signer);
    const id = refundRequestId.value as number;

    let method: 'requestSwapRefund' | 'requestLiquidityAddingRefund' | 'requestLiquidityRemovalRefund';
    if (selectedRefundType.value === 'add') {
      method = 'requestLiquidityAddingRefund';
      loadingMessage.value = 'Submitting add-liquidity refund request...';
    } else if (selectedRefundType.value === 'remove') {
      method = 'requestLiquidityRemovalRefund';
      loadingMessage.value = 'Submitting remove-liquidity refund request...';
    } else {
      method = 'requestSwapRefund';
      loadingMessage.value = 'Submitting swap refund request...';
    }

    const anchorBlock = await provider!.getBlockNumber();
    const refundEvt = waitForEventOnce(pair, 'Refund', { fromBlock: anchorBlock });

    const tx = await pair[method](id);
    const rcpt = await tx.wait();
    if (!rcpt?.status) throw new Error('Refund transaction failed');

    await refundEvt;

    showSuccessModal(`Refund claimed for request ${id}.`);
    refundRequestId.value = null;
  } catch (e) {
    console.error(e);
    const msg =
      selectedRefundType.value === 'add'
        ? 'Failed to claim add-liquidity refund'
        : selectedRefundType.value === 'remove'
          ? 'Failed to claim remove-liquidity refund'
          : 'Failed to claim swap refund';
    showErrorModal(msg);
  } finally {
    pending.refund = false;
    showLoading.value = false;
  }
}
// MetaMask functions
const checkMetaMaskConnection = async (): Promise<void> => {
  if (typeof window !== 'undefined' && window.ethereum) {
    isMetaMaskInstalled.value = true;

    try {
      // Check if already connected
      const accounts = await window.ethereum.request({ method: 'eth_accounts' })
      if (accounts.length > 0) {
        account.value = accounts[0]
        isConnected.value = true

        // Get chain ID
        chainId.value = await window.ethereum.request({ method: 'eth_chainId' })

      }

      // Listen for account changes
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) {
          // User disconnected
          isConnected.value = false
          account.value = ''
        } else {
          account.value = accounts[0]
          isConnected.value = true
        }
      })

      // Listen for chain changes
      window.ethereum.on('chainChanged', (newChainId: string) => {
        chainId.value = newChainId
        // Reload the page on chain change
        window.location.reload()
      })

    } catch (error) {
      console.error('Error checking MetaMask connection:', error)
    }
  }
}

async function switchToRequiredNetwork() {
  if (!window?.ethereum) return showErrorModal('MetaMask not available.');

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: REQUIRED_CHAIN_ID_HEX }],
    });

    chainId.value = REQUIRED_CHAIN_ID_HEX; // keep local state in sync
    showSuccessModal(`Switched to ${REQUIRED_NETWORK.chainName}.`);

    if (isConnected.value) {
      await fetchTokenSymbols();
      await fetchPrice();
      maybeShowPOCModal();
    }
  } catch (err: any) {
    // If the chain hasn't been added to MetaMask
    if (err?.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: REQUIRED_CHAIN_ID_HEX,
            chainName: REQUIRED_NETWORK.chainName,
            nativeCurrency: REQUIRED_NETWORK.nativeCurrency,
            rpcUrls: [REQUIRED_NETWORK.rpcUrl],
            blockExplorerUrls: [REQUIRED_NETWORK.blockExplorerUrl],
          }],
        });
        chainId.value = REQUIRED_CHAIN_ID_HEX;
        showSuccessModal(`Added and switched to ${REQUIRED_NETWORK.chainName}.`);
        if (isConnected.value) {
          await fetchTokenSymbols();
          await fetchPrice();
          maybeShowPOCModal();
        }
      } catch {
        showErrorModal('Please approve adding the network in MetaMask.');
      }
    } else if (err?.code === 4001) {
      // User rejected request
      showErrorModal('Please approve the network switch in MetaMask.');
    } else {
      showErrorModal('Unable to switch network.');
    }
  }
}


const connectMetaMask = async (): Promise<void> => {
  if (!isMetaMaskInstalled.value) {
    showErrorModal('Please install MetaMask to use this application')
    return
  }

  pending.metamask = true

  try {
    // Request account access
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    account.value = accounts[0]
    isConnected.value = true

    // Get chain ID
    chainId.value = await window.ethereum.request({ method: 'eth_chainId' })

    console.log('Connected to MetaMask:', account.value)

    // Check if on the correct network
    if (chainId.value.toLowerCase() !== REQUIRED_CHAIN_ID_HEX) {
      await switchToRequiredNetwork(); // opens MetaMask "switch network" modal
    } else {
      showSuccessModal(`Successfully connected to MetaMask: ${truncateAddress(account.value)}`);
      await fetchTokenSymbols();
      await fetchPrice();
    }
  } catch (error) {
    console.error('Error connecting to MetaMask:', error)
    showErrorModal('Failed to connect to MetaMask')
  } finally {
    pending.metamask = false
  }
}

// Swap functions
function calculateSwap() {
  if (!T0T1Rate.value || T0T1Rate.value <= 0) { toAmount.value = 0; swapRate.value = 0; return; }
  if (fromCurrency.value == config.value.TOKEN0_SYMBOL && toCurrency.value == config.value.TOKEN1_SYMBOL) {
    toAmount.value = parseFloat((fromAmount.value * T0T1Rate.value).toFixed(2))
    swapRate.value = T0T1Rate.value
  } else {
    toAmount.value = parseFloat((fromAmount.value / T0T1Rate.value).toFixed(2))
    swapRate.value = 1 / T0T1Rate.value
  }
}

const switchTokens = (): void => {
  const temp = fromCurrency.value
  fromCurrency.value = toCurrency.value
  toCurrency.value = temp

  // Also swap the amounts
  const tempAmount = fromAmount.value
  fromAmount.value = toAmount.value
  toAmount.value = tempAmount

  // Recalculate rate
  if (T0T1Rate.value) {
    swapRate.value = fromCurrency.value == config.value.TOKEN0_SYMBOL ? T0T1Rate.value : 1 / T0T1Rate.value
  }
}

async function decryptSwapOutputs(encryptedAmount0In: any, encryptedAmount1In: any, encryptedAmount0Out: any, encryptedAmount1Out: any) {
  const signer = provider ? await provider.getSigner() : null;
  if (!signer) {
    showErrorModal('No wallet connected. Please connect MetaMask.');
    return;
  }

  const keypair = fhevmInstance.generateKeypair();
  const handleContractPairs = [
    {
      handle: encryptedAmount0In,
      contractAddress: config.value.PAIR_ADDRESS,
    },
    {
      handle: encryptedAmount1In,
      contractAddress: config.value.PAIR_ADDRESS,
    },
    {
      handle: encryptedAmount0Out,
      contractAddress: config.value.PAIR_ADDRESS,
    },
    {
      handle: encryptedAmount1Out,
      contractAddress: config.value.PAIR_ADDRESS,
    },
  ];
  const startTimeStamp = Math.floor(Date.now() / 1000).toString();
  const durationDays = "10";
  const contractAddresses = [config.value.PAIR_ADDRESS];

  const eip712 = fhevmInstance.createEIP712(keypair.publicKey, contractAddresses, startTimeStamp, durationDays);

  const signature = await signer.signTypedData(
    eip712.domain,
    {
      UserDecryptRequestVerification: eip712.types.UserDecryptRequestVerification,
    },
    eip712.message,
  );

  const result = await fhevmInstance.userDecrypt(
    handleContractPairs,
    keypair.privateKey,
    keypair.publicKey,
    signature.replace("0x", ""),
    contractAddresses,
    await signer.getAddress(),
    startTimeStamp,
    durationDays,
  );

  const decryptedAmount0In = result[encryptedAmount0In];
  const decryptedAmount1In = result[encryptedAmount1In];
  const decryptedAmount0Out = result[encryptedAmount0Out];
  const decryptedAmount1Out = result[encryptedAmount1Out];
  return [decryptedAmount0In, decryptedAmount1In, decryptedAmount0Out, decryptedAmount1Out];
}

function logEventPretty(name: string, fields: Record<string, any>) {
  let out = `Event triggered: ${name} \n`;
  for (const [k, v] of Object.entries(fields)) out += `\t\t${k} = ${v}\n`;
  console.log(out);
}

function argsToNamedObject(fragment: any, args: any[]) {
  const out: Record<string, any> = {};
  (fragment?.inputs || []).forEach((inp: any, i: number) => {
    const key = inp?.name || `arg${i}`;
    out[key] = args[i];
  });
  return out;
}

function waitForEventOnce(
  contract: ethers.Contract,
  eventName: string,
  { fromBlock, timeoutMs = 20 * 60 * 1000, pollMs = 7000, filter }: {
    fromBlock: number;
    timeoutMs?: number;
    pollMs?: number;
    filter?: (args: any[], event: any) => boolean;
  }
): Promise<{ args: any[]; blockNumber: number; txHash: string }> {
  return new Promise((resolve, reject) => {
    const ev: any = (contract as any).getEvent(eventName); // <-- cast to any
    let timer: any;

    const finish = (args: any[], eventLike: any) => {
      const bn = eventLike?.log?.blockNumber ?? eventLike?.blockNumber ?? 0;
      const hash = eventLike?.log?.transactionHash ?? eventLike?.transactionHash ?? "";
      // ev.fragment is also "any"
      logEventPretty(eventName, { ...argsToNamedObject(ev.fragment, args), blockNumber: bn, txHash: hash });
      clearTimeout(timer);
      contract.off(ev, listener);
      resolve({ args, blockNumber: bn, txHash: hash });
    };

    const listener = (...params: any[]) => {
      const event = params[params.length - 1];
      const args = params.slice(0, params.length - 1);
      const bn = event?.log?.blockNumber ?? 0;
      if (bn < fromBlock) return;
      if (filter && !filter(args, event)) return;
      finish(args, event);
    };

    contract.on(ev, listener);

    const poll = async () => {
      try {
        const latest = await provider!.getBlockNumber();
        const logs = await provider!.getLogs({
          address: contract.target,
          fromBlock,
          toBlock: latest,
          topics: [ev.topicHash], // cast makes TS happy
        });

        for (const log of logs) {
          try {
            const parsed = contract.interface.parseLog(log);
            if (!parsed || parsed.name !== eventName) continue;
            const args = Array.from(parsed.args ?? []);
            if (filter && !filter(args, { log })) continue;
            finish(args, log);
            return;
          } catch {
            // ignore
          }
        }
      } catch {
        // ignore transient provider errors
      }
      setTimeout(poll, pollMs);
    };
    poll();

    timer = setTimeout(() => {
      contract.off(ev, listener);
      reject(new Error(`Timeout waiting for ${eventName} event`));
    }, timeoutMs);
  });
}


async function executeSwap() {
  if (!isConnected.value) return showErrorModal("Please connect your wallet first.");
  if (!fromAmount.value || fromAmount.value <= 0) return showErrorModal("Enter an amount to swap.");

  try {
    const signer = provider ? await provider.getSigner() : null;
    if (!signer) throw new Error("No wallet connected.");

    const inputIsToken0 = fromCurrency.value === config.value.TOKEN0_SYMBOL;

    console.log(`Swapping ${fromAmount.value} ${inputIsToken0 ? config.value.TOKEN0_SYMBOL : config.value.TOKEN1_SYMBOL} for ${toCurrency.value}`);

    pending.swap = true;
    loadingMessage.value = "Checking operator status on both tokens…";
    showLoading.value = true;

    const token0 = new ethers.Contract(config.value.TOKEN0_ADDRESS, ERC7984_ABI.abi, signer);
    const token1 = new ethers.Contract(config.value.TOKEN1_ADDRESS, ERC7984_ABI.abi, signer);
    const isOp0 = await token0.isOperator(await signer.getAddress(), config.value.PAIR_ADDRESS);
    const isOp1 = await token1.isOperator(await signer.getAddress(), config.value.PAIR_ADDRESS);
    if (!isOp0) return showErrorModal(`Please set the pair as operator on ${config.value.TOKEN0_SYMBOL} first.`);
    if (!isOp1) return showErrorModal(`Please set the pair as operator on ${config.value.TOKEN1_SYMBOL} first.`);

    const pair = new ethers.Contract(config.value.PAIR_ADDRESS, CAMMPAIR_ABI.abi, signer);

    const anchorBlock = await provider!.getBlockNumber();

    loadingMessage.value = "Preparing swap transaction…";

    const a0 = inputIsToken0 ? BigInt(fromAmount.value) * tokenFactor : BigInt(0);
    const a1 = inputIsToken0 ? BigInt(0) : BigInt(fromAmount.value) * tokenFactor;

    const buffer = fhevmInstance.createEncryptedInput(await pair.getAddress(), await signer.getAddress());
    buffer.add64(a0);
    buffer.add64(a1);
    const ciphertexts = await buffer.encrypt();

    const block = await provider!.getBlock("latest");
    const deadline = block!.timestamp + 1000;

    const userAdd = (await signer.getAddress()).toLowerCase();

    const decReqPromise = waitForEventOnce(pair, "decryptionRequested", { fromBlock: anchorBlock });
    const swapEvPromise = waitForEventOnce(pair, "Swap", {
      fromBlock: anchorBlock,
      filter: (args) => {
        const to = (args[5] ?? "").toLowerCase();
        return to === userAdd;
      },
    });

    loadingMessage.value = "Submitting swap…";
    const tx = await pair["swapTokens(bytes32,bytes32,address,uint256,bytes)"](
      ciphertexts.handles[0],
      ciphertexts.handles[1],
      await signer.getAddress(),
      deadline,
      ciphertexts.inputProof
    );
    const receipt = await tx.wait();
    console.log("Swap tx status:", receipt?.status);
    if (!receipt?.status) throw new Error("Swap transaction failed.");

    const decEv = await decReqPromise;
    addDecryptionRequest("Swap", Number(decEv.args[1]), String(decEv.args[2]), config.value.PAIR_ADDRESS);

    loadingMessage.value = "Waiting for swap to be processed (gateway response)…";
    const ev = await swapEvPromise;
    const [sender, a0In, a1In, a0Out, a1Out, to] =
      ev.args as [string, string, string, string, string, string];


    let msg = "Swap executed successfully!";
    try {
      loadingMessage.value = "Decrypting swap amounts…";
      const res = await decryptSwapOutputs(a0In, a1In, a0Out, a1Out);
      if (res) {
        const [d0In, d1In, d0Out, d1Out] = res;
        const f = (bn: any) => parseFloat(ethers.formatUnits(bn, 6));
        msg = `Swap complete: +${f(d0Out)} ${config.value.TOKEN0_SYMBOL}, +${f(d1Out)} ${config.value.TOKEN1_SYMBOL} `
          + `(spent ${f(d0In)} ${config.value.TOKEN0_SYMBOL}, ${f(d1In)} ${config.value.TOKEN1_SYMBOL}).`;
      }
    } catch { }

    showSuccessModal(msg);
    fromAmount.value = 0;
    toAmount.value = 0;
  } catch (err) {
    console.error("Swap error:", err);
    showErrorModal("Failed to execute swap.");
  } finally {
    pending.swap = false;
    showLoading.value = false;
  }
}

// Modal functions
const showSuccessModal = (message: string): void => {
  successMessage.value = message
  showSuccess.value = true

  // Auto close after 5 seconds
  setTimeout(() => {
    closeSuccessModal()
  }, 5000)
}

const closeSuccessModal = (): void => {
  showSuccess.value = false
  successMessage.value = ''
}

const showErrorModal = (message: string): void => {
  errorMessage.value = message
  showError.value = true

  // Auto close after 5s 
  setTimeout(() => {
    closeErrorModal()
  }, 5000)
}

const closeErrorModal = (): void => {
  showError.value = false
  errorMessage.value = ''
}
// Utility functions
const truncateAddress = (address: string): string => {
  if (!address) return ''
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

// Simple address validation
function isValidAddress(addr: string) {
  return /^0x[a-fA-F0-9]{40}$/.test(addr);
}

// Minimal ERC7984-ness check (calls unique funcs; will revert if not supported)
async function isERC7984Token(address: string): Promise<boolean> {
  try {
    const signer = provider ? await provider.getSigner() : null;
    if (!signer) throw new Error("No wallet connected.");
    const t = new ethers.Contract(address, ERC7984_ABI.abi, signer);

    // These should exist on your ConfidentialToken (ERC-7984 impl)
    await t.symbol(); // common, but quick type sanity
    await t.isOperator(await signer.getAddress(), await signer.getAddress()); // specific to 7984 impl used here
    await t.confidentialBalanceOf(await signer.getAddress());                // returns bytes32 handle (0 if none)
    return true;
  } catch {
    return false;
  }
}

// Deploy a ConfidentialToken with your artifact (must include bytecode in JSON)
async function deployConfidentialToken(name: string, symbol: string): Promise<string> {
  const signer = provider ? await provider.getSigner() : null;
  if (!signer) throw new Error("No wallet connected.");

  const bytecode = (ERC7984_ABI as any).bytecode;
  if (!bytecode || bytecode === '0x' || bytecode.length < 4) {
    throw new Error("ERC7984_ABI.json missing bytecode. Rebuild artifacts to include it.");
  }

  console.log(`Deploying ConfidentialToken: "${name}" (${symbol})`);
  const factory = new ethers.ContractFactory(ERC7984_ABI.abi, bytecode, signer);
  const contract = await factory.deploy(name, symbol);
  loadingMessage.value = `Deploying ${symbol}…`;
  await contract.waitForDeployment();
  const addr = await contract.getAddress();
  console.log(`${symbol} deployed at ${addr}`);
  return addr;
}

// Factory helper
async function factoryCreatePair(t0: string, t1: string): Promise<string> {
  const signer = provider ? await provider.getSigner() : null;
  if (!signer) throw new Error("No wallet connected.");
  const factory = new ethers.Contract(CAMM_ENV.FACTORY_ADDRESS, CAMMFACTORY_ABI.abi, signer);

  loadingMessage.value = "Submitting createPair transaction…";
  const tx = await factory.createPair(t0, t1);
  const rcpt = await tx.wait();
  if (!rcpt?.status) throw new Error("createPair transaction failed.");

  const pairAddr = await factory.getPair(t0, t1);
  if (!pairAddr || pairAddr === ethers.ZeroAddress) throw new Error("Factory returned zero pair address.");
  return pairAddr;
}

// Apply new pair to app (reuse your existing helpers)
async function applyNewPair(pairAddr: string) {
  config.value.PAIR_ADDRESS = pairAddr;
  await fetchTokenSymbols();
  await fetchPrice();
  // optional: activeTab.value = 'pair';
}

// UI actions
async function deployToken() {
  if (!isConnected.value) return showErrorModal("Please connect your wallet first.");
  if (!newTokenName.value || !newTokenSymbol.value) return showErrorModal("Enter token name & symbol.");
  if (newTokenSymbol.value.length > 5) return showErrorModal("Token symbol max length is 5 characters.");
  console.log(`Deploying new token: ${newTokenName.value} (${newTokenSymbol.value})`);

  try {
    pending.deployToken = true;
    loadingMessage.value = "Deploying token…";
    showLoading.value = true;

    const addr = await deployConfidentialToken(newTokenName.value, newTokenSymbol.value);
    addDeployedTokenToHistory(addr, newTokenName.value, newTokenSymbol.value);
    showSuccessModal(`Deployed ${newTokenSymbol.value} at ${addr}`);
    console.log("New token address:", addr);
    newTokenName.value = '';
    newTokenSymbol.value = '';
  } catch (e: any) {
    console.error(e);
    showErrorModal(e?.message || "Failed to deploy token.");
  } finally {
    pending.deployToken = false;
    showLoading.value = false;
  }
}

async function createPairFromInputs() {
  if (!isConnected.value) return showErrorModal("Please connect your wallet first.");

  const t0 = createPairT0.value.trim();
  const t1 = createPairT1.value.trim();

  console.log(`Creating pair for tokens: ${t0} & ${t1}`);

  if (!isValidAddress(t0) || !isValidAddress(t1)) {
    console.error("Invalid token address format.");
    return showErrorModal("Please enter valid token addresses (0x…40 hex).");
  }
  if (t0.toLowerCase() === t1.toLowerCase()) {
    console.error("Token0 and Token1 are identical.");
    return showErrorModal("Token0 and Token1 must be different.");
  }

  try {
    pending.createPair = true;
    loadingMessage.value = "Validating tokens are ERC7984…";
    showLoading.value = true;

    const [ok0, ok1] = await Promise.all([isERC7984Token(t0), isERC7984Token(t1)]);
    if (!ok0 || !ok1) {
      console.error("One or both tokens are not ERC7984.");
      return showErrorModal("Both addresses must be ERC7984 confidential tokens.");
    }

    loadingMessage.value = "Creating pair on factory…";
    const pairAddr = await factoryCreatePair(t0, t1);

    await addPairToHistory(pairAddr);
    await applyNewPair(pairAddr);
    console.log("New pair address:", pairAddr);
    showSuccessModal(`Pair created: ${pairAddr}`);
  } catch (e: any) {
    console.error(e);
    showErrorModal(e?.message || "Failed to create pair.");
  } finally {
    pending.createPair = false;
    showLoading.value = false;
  }
}

const fetchTokenSymbols = async (): Promise<void> => {
  try {
    const signer = provider ? await provider.getSigner() : null;
    if (!signer) {
      showErrorModal('No wallet connected. Please connect MetaMask.');
      return;
    }
    const pairInstance = new ethers.Contract(config.value.PAIR_ADDRESS, CAMMPAIR_ABI.abi, signer);

    const token0Address = await pairInstance.token0Address();
    const token1Address = await pairInstance.token1Address();

    console.log("Token0 address:", token0Address);
    console.log("Token1 address:", token1Address);

    const token0Instance = new ethers.Contract(token0Address, ERC7984_ABI.abi, signer);
    const token1Instance = new ethers.Contract(token1Address, ERC7984_ABI.abi, signer);

    // Fetch symbols
    const token0Symbol = await token0Instance.symbol();
    const token1Symbol = await token1Instance.symbol();
    const pairSymbol = await pairInstance.symbol();

    console.log("Fetched Symbols:", token0Symbol, token1Symbol, pairSymbol);

    // Update the config dynamically
    config.value.TOKEN0_SYMBOL = token0Symbol;
    config.value.TOKEN1_SYMBOL = token1Symbol;
    config.value.LPTOKEN_SYMBOL = pairSymbol;

    config.value.TOKEN0_ADDRESS = token0Address;
    config.value.TOKEN1_ADDRESS = token1Address;

    fromCurrency.value = token0Symbol;
    toCurrency.value = token1Symbol;

    tokenAirdrop.value = token0Symbol;
    transferToken.value = token0Symbol;
    operatorToken.value = token0Symbol;

    console.log(`Fetched Symbols: ${token0Symbol} / ${token1Symbol} / ${pairSymbol}`);
    console.log("Fetching Price");
    fetchPrice();
  } catch (error) {
    console.error("Error fetching token symbols:", error);
  }
};

async function searchPair() {
  try {
    const signer = provider ? await provider.getSigner() : null;
    if (!signer) {
      showErrorModal('No wallet connected. Please connect MetaMask.');
      return;
    }
    if (!searchToken0Input.value || !searchToken1Input.value) {
      showErrorModal('Please enter both token addresses.');
      return;
    }
    // Create contract instances
    const factoryInstance = new ethers.Contract(CAMM_ENV.FACTORY_ADDRESS, CAMMFACTORY_ABI.abi, signer);
    const pairAddress = await factoryInstance.getPair(searchToken0Input.value, searchToken1Input.value);
    console.log("Fetched Pair address:", pairAddress);
    if (pairAddress === ethers.ZeroAddress) {
      showErrorModal('No pair found for the given token addresses.');
      return;
    }

    const pairInstance = new ethers.Contract(pairAddress, CAMMPAIR_ABI.abi, signer);
    const token0Address = await pairInstance.token0Address();
    const token1Address = await pairInstance.token1Address();
    console.log("Token0 address:", token0Address);
    console.log("Token1 address:", token1Address);

    const token0Instance = new ethers.Contract(token0Address, ERC7984_ABI.abi, signer);
    const token1Instance = new ethers.Contract(token1Address, ERC7984_ABI.abi, signer);

    // Fetch symbols
    const token0Symbol = await token0Instance.symbol();
    const token1Symbol = await token1Instance.symbol();
    const pairSymbol = await pairInstance.symbol();

    console.log("Fetched Symbols:", token0Symbol, token1Symbol, pairSymbol);

    // Update the config dynamically
    config.value.PAIR_ADDRESS = pairAddress;
    config.value.TOKEN0_SYMBOL = token0Symbol;
    config.value.TOKEN1_SYMBOL = token1Symbol;
    config.value.LPTOKEN_SYMBOL = pairSymbol;
    config.value.TOKEN0_ADDRESS = token0Address;
    config.value.TOKEN1_ADDRESS = token1Address;

    showSuccessModal(`Found pair: ${token0Symbol}/${token1Symbol} at address ${pairAddress}`);
    fetchPrice();
  } catch (error) {
    console.error("Error fetching token symbols:", error);
  }
}

onMounted(async () => {
  // Check MetaMask connection
  const sdk = await import(/* @vite-ignore */ SDK_URL);
  initSDK = sdk.initSDK;
  createInstance = sdk.createInstance;
  SepoliaConfig = sdk.SepoliaConfig;

  maybeShowPOCModal();
  await initSDK();
  checkMetaMaskConnection();
  console.log("Creating instance ...");
  console.log("SepoliaConfig:", SepoliaConfig);

  const fhevmConfig = { ...SepoliaConfig, network: window.ethereum };
  fhevmInstance = await createInstance(fhevmConfig);

  console.log("FHEVM instance created:", fhevmInstance);

  if (isConnected.value && !isWrongNetwork.value) {
    await fetchTokenSymbols();
  }
  deduplicateDecryptionRequests();
})
</script>

<style>
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}

.spin-c {
  animation: spin-c 1.1s linear infinite;
  transform-origin: 32px 32px;
  /* center of the 64x64 viewBox */
}

@keyframes spin-c {
  to {
    transform: rotate(360deg);
  }
}
</style>