(function () {
  "use strict";
  const $ = id => document.getElementById(id);
  const out = $("toolResult");
  const show = text => { if (out) out.textContent = String(text); };
  const fail = message => show("Input error: " + message);

  function parseBase(raw, base) {
    let s = String(raw).trim();
    if (!s) throw new Error("Enter a value.");
    if (s.length > 4096) throw new Error("Maximum input length is 4096 characters.");
    let sign = 1n;
    if (s[0] === "-" || s[0] === "+") {
      if (s[0] === "-") sign = -1n;
      s = s.slice(1);
    }
    if (base === 2 && /^0b/i.test(s)) s = s.slice(2);
    if (base === 8 && /^0o/i.test(s)) s = s.slice(2);
    if (base === 16 && /^0x/i.test(s)) s = s.slice(2);
    if (!s) throw new Error("Enter digits after the sign or prefix.");
    const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let value = 0n;
    for (const ch of s.toUpperCase()) {
      const digit = chars.indexOf(ch);
      if (digit < 0 || digit >= base) throw new Error("A digit is invalid for base " + base + ".");
      value = value * BigInt(base) + BigInt(digit);
    }
    return sign * value;
  }

  function formatBase(value, base) {
    if (value === 0n) return "0";
    const negative = value < 0n;
    let n = negative ? -value : value;
    const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let result = "";
    while (n > 0n) {
      result = chars[Number(n % BigInt(base))] + result;
      n = n / BigInt(base);
    }
    return (negative ? "-" : "") + result;
  }

  function numberSystem() {
    const from = Number($("nsFrom").value), to = Number($("nsTo").value);
    if (!Number.isInteger(from) || from < 2 || from > 36 ||
        !Number.isInteger(to) || to < 2 || to > 36) {
      throw new Error("Input and output bases must be whole numbers from 2 to 36.");
    }
    const a = parseBase($("nsValue").value, from);
    const op = $("nsOperation").value;
    let result = a;
    if (op !== "convert") {
      const b = parseBase($("nsSecond").value, from);
      if (op === "add") result = a + b;
      else if (op === "subtract") result = a - b;
      else if (op === "multiply") result = a * b;
      else throw new Error("Choose a supported operation.");
    }
    show("Result in base " + to + ": " + formatBase(result, to) +
      "\nExact decimal value: " + result.toString());
  }

  function twosComplement() {
    const raw = $("tcValue").value.trim(), bits = Number($("tcBits").value);
    if (!/^[+-]?\d+$/.test(raw)) throw new Error("Enter a whole signed decimal integer.");
    if (!Number.isInteger(bits) || bits < 1 || bits > 1024) {
      throw new Error("Bit width must be a whole number from 1 to 1024.");
    }
    const value = BigInt(raw), modulus = 1n << BigInt(bits);
    const min = -(1n << BigInt(bits - 1)), max = (1n << BigInt(bits - 1)) - 1n;
    if (value < min || value > max) {
      throw new Error("Value is outside the signed " + bits + "-bit range (" + min + " to " + max + ").");
    }
    const unsigned = value < 0n ? modulus + value : value;
    const binary = unsigned.toString(2).padStart(bits, "0");
    const hex = unsigned.toString(16).toUpperCase().padStart(Math.ceil(bits / 4), "0");
    show("Signed decimal: " + value.toString() +
      "\n" + bits + "-bit binary: " + binary +
      "\nHexadecimal: 0x" + hex +
      "\nUnsigned interpretation: " + unsigned.toString());
  }

  function ieee754() {
    const mode = $("ieeeMode").value, raw = $("ieeeValue").value.trim();
    if (!raw) throw new Error("Enter a number or a 32-bit pattern.");
    const buffer = new ArrayBuffer(4), view = new DataView(buffer);
    let bits, number;
    if (mode === "encode") {
      number = Number(raw);
      if (!Number.isFinite(number)) throw new Error("Enter a finite decimal number.");
      view.setFloat32(0, number, false);
      if (!Number.isFinite(view.getFloat32(0, false))) {
        throw new Error("This value exceeds the finite Float32 range.");
      }
      bits = view.getUint32(0, false);
    } else {
      let s = raw.replace(/\s+/g, "");
      if (/^0x/i.test(s)) s = s.slice(2);
      if (/^[01]{32}$/.test(s)) bits = Number.parseInt(s, 2);
      else if (/^[0-9a-fA-F]{8}$/.test(s)) bits = Number.parseInt(s, 16);
      else throw new Error("For decoding, enter exactly 32 binary digits or 8 hexadecimal digits.");
      view.setUint32(0, bits, false);
      number = view.getFloat32(0, false);
    }
    const binary = bits.toString(2).padStart(32, "0");
    const hex = bits.toString(16).toUpperCase().padStart(8, "0");
    const sign = binary[0], exponent = binary.slice(1, 9), fraction = binary.slice(9);
    show("32-bit binary: " + binary +
      "\nHexadecimal: 0x" + hex +
      "\nSign bit: " + sign +
      "\nExponent bits: " + exponent +
      "\nFraction bits: " + fraction +
      "\nDecoded float32 value: " + String(number));
  }

  function binaryFraction() {
    const mode = $("bfMode").value, raw = $("bfValue").value.trim();
    const precision = Number($("bfPrecision").value);
    if (!Number.isInteger(precision) || precision < 1 || precision > 32) {
      throw new Error("Fractional precision must be a whole number from 1 to 32.");
    }
    if (!raw) throw new Error("Enter a value.");
    if (mode === "toDecimal") {
      if (!/^[+-]?(?:[01]+(?:\.[01]*)?|\.[01]+)$/.test(raw)) {
        throw new Error("Use only binary digits 0 and 1, with an optional binary point.");
      }
      let s = raw, sign = 1;
      if (s[0] === "-" || s[0] === "+") {
        if (s[0] === "-") sign = -1;
        s = s.slice(1);
      }
      const parts = s.split(".");
      const integerDigits = parts[0] || "0";
      if (integerDigits.length > 53) {
        throw new Error("Use at most 53 binary integer digits to avoid decimal precision loss.");
      }
      const integer = Number.parseInt(integerDigits, 2);
      if (!Number.isFinite(integer)) throw new Error("The integer part is too large.");
      let fraction = 0;
      const digits = parts[1] || "";
      for (let i = 0; i < digits.length; i++) {
        if (digits[i] === "1") fraction += Math.pow(2, -(i + 1));
      }
      show("Decimal value: " + String(sign * (integer + fraction)) +
        "\nBinary input: " + raw);
    } else {
      const value = Number(raw);
      if (!Number.isFinite(value)) throw new Error("Enter a finite decimal number.");
      const sign = value < 0 ? "-" : "";
      let n = Math.abs(value), integer = Math.floor(n);
      let fraction = n - integer;
      let result = integer.toString(2), digits = "";
      for (let i = 0; i < precision && fraction > 0; i++) {
        fraction *= 2;
        if (fraction >= 1) { digits += "1"; fraction -= 1; }
        else digits += "0";
      }
      const truncated = fraction > 1e-12;
      show("Binary approximation: " + sign + result +
        (digits ? "." + digits : "") +
        (truncated ? "…" : "") +
        "\nFractional bits requested: " + precision +
        "\n" + (truncated ? "Some fractional digits remain; increase precision for a longer approximation." : "The fraction terminated within the selected precision."));
    }
  }

  function asciiUnicode() {
    const mode = $("auMode").value, raw = $("auInput").value;
    if (raw.length === 0) throw new Error("Enter text or code points.");
    if (mode === "textToCodes") {
      const lines = Array.from(raw).map(ch => {
        const cp = ch.codePointAt(0);
        const visible = ch === "\n" ? "\\n" : ch === "\r" ? "\\r" : ch === "\t" ? "\\t" : ch;
        return visible + "  |  U+" + cp.toString(16).toUpperCase().padStart(4, "0") +
          "  |  decimal " + cp;
      });
      show(lines.join("\n"));
    } else {
      const tokens = raw.trim().split(/[\s,;]+/).filter(Boolean);
      const chars = tokens.map(token => {
        let cp;
        if (/^U\+[0-9a-f]+$/i.test(token)) cp = Number.parseInt(token.slice(2), 16);
        else if (/^0x[0-9a-f]+$/i.test(token)) cp = Number.parseInt(token.slice(2), 16);
        else if (/^\d+$/.test(token)) cp = Number.parseInt(token, 10);
        else throw new Error("Invalid code-point token: " + token);
        if (!Number.isInteger(cp) || cp < 0 || cp > 0x10FFFF ||
            (cp >= 0xD800 && cp <= 0xDFFF)) {
          throw new Error("Code point is outside the valid Unicode range: " + token);
        }
        return String.fromCodePoint(cp);
      });
      show(chars.join(""));
    }
  }

  function calculate() {
    try {
      const key = document.body.dataset.numberTool;
      if (key === "number-system-converter") numberSystem();
      else if (key === "twos-complement-converter") twosComplement();
      else if (key === "ieee-754-converter") ieee754();
      else if (key === "binary-fraction-converter") binaryFraction();
      else if (key === "ascii-unicode-converter") asciiUnicode();
      else throw new Error("Unknown tool configuration.");
    } catch (error) {
      fail(error && error.message ? error.message : "Check your input and try again.");
    }
  }

  // Old URLs pass their original conversion mode through the query string.
  const params = new URLSearchParams(window.location.search);
  const nsFrom = $("nsFrom");
  const nsTo = $("nsTo");
  const nsOperation = $("nsOperation");

  if (nsFrom && params.has("from")) nsFrom.value = params.get("from");
  if (nsTo && params.has("to")) nsTo.value = params.get("to");
  if (nsOperation && params.has("op")) nsOperation.value = params.get("op");

  function updateNumberSystemUI() {
    const second = $("nsSecond");
    const operation = $("nsOperation");
    if (second && operation && second.parentElement) {
      second.parentElement.hidden = operation.value === "convert";
    }
  }
  if (nsOperation) nsOperation.addEventListener("change", updateNumberSystemUI);
  updateNumberSystemUI();

  [
    "nsFrom", "nsTo", "nsOperation", "nsValue", "nsSecond",
    "tcValue", "tcBits", "ieeeMode", "ieeeValue",
    "bfMode", "bfValue", "bfPrecision", "auMode", "auInput"
  ].forEach(id => {
    const field = $(id);
    if (field) {
      field.addEventListener("input", () => { if (out) out.textContent = ""; });
      field.addEventListener("change", () => { if (out) out.textContent = ""; });
    }
  });

  const button = $("calculateBtn");
  if (button) button.addEventListener("click", calculate);
})();