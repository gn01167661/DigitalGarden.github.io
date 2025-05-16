# 嵌入式系統常見記憶體區段

以下各區段皆由 Linker Script 定義，並由啟動程式（Startup Code）負責初始化與搬遷。

## 1. `.text`（程式碼區）
- **用途**：存放所有可執行指令（函式、ISR、Vector Table）。  
- **屬性**：位於 Flash/ROM，不可寫入；CPU 以指令抓取方式執行。

## 2. `.rodata`（唯讀常數區）
- **用途**：存放 `const` 資料、字串常量。  
- **屬性**：位於 Flash/ROM；節省 RAM 使用。

## 3. `.data`（已初始化資料區）
- **用途**：存放全域／靜態變數且初值非零者。  
- **流程**：  
  1. 連結器把對應資料寫入 Flash。  
  2. 啟動程式啟動後，把 Flash 中資料複製到 RAM。

## 4. `.bss`（未初始化或全零資料區）
- **用途**：存放未顯式初始化的全域／靜態變數（C 標準要求預設為 0）。  
- **流程**：啟動程式在 SRAM 清零此區段。

## 5. Heap（動態分配區）
- **用途**：供 `malloc()`、`new` 等動態記憶體分配函式使用。  
- **配置**：大小與起始位置由 Linker Script 或 C 標準函式庫設定；需控制最大容量以免碎片化。

## 6. Stack（堆疊區）
- **用途**：存放自動變數、函式呼叫框架（返回地址、暫存器備份等）。  
- **RTOS**：各 Task/Thread 可擁有獨立 Stack；大小於 RTOS 設定或 Linker Script 中定義。

## 7. 特殊用途區段（Special Sections）
- **`.isr_vector`**：ISR 向量表，通常放在 Flash 起始位址。  
- **`.init` / `.fini`**：C 語言初始化／終結函式。  
- **`.fastcode` / `.ccmram`**：部署高時效性程式碼於 MCU 內部快取 RAM。

---

## Linker Script 要點

```ld
MEMORY
{
  FLASH  (rx)  : ORIGIN = 0x08000000, LENGTH = 512K
  SRAM   (rwx) : ORIGIN = 0x20000000, LENGTH = 128K
}

SECTIONS
{
  .isr_vector  : { KEEP(*(.isr_vector)) } > FLASH
  .text        : { *(.text*) }             > FLASH
  .rodata      : { *(.rodata*) }           > FLASH
  .data        : { *(.data*) }             > FLASH
  .bss         : { *(.bss*) }              > SRAM
  /* 其他區段定義… */
}
