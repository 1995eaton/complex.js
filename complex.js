function complex(real, imag) {
  if (real instanceof complex)
    return new complex(real.real, real.imag);
  if (!(this instanceof complex))
    return new complex(real, imag);
  this.real = real;
  this.imag = imag === void 0 ? 0 : imag;
}

(function() {
  function extend(a, b) {
    Object.getOwnPropertyNames(b).forEach(function(name) {
      a[name] = b[name];
    });
  }
  function zfunc(fn) {
    return function() {
      return fn.call(this, complex.apply(null, arguments));
    };
  }
  extend(complex.prototype, {
    add: zfunc(function(z) {
      z.real += this.real;
      z.imag += this.imag;
      return z;
    }),
    sub: zfunc(function(z) {
      z.real = this.real - z.real;
      z.imag = this.imag - z.imag;
      return z;
    }),
    mul: zfunc(function(z) {
      var re = z.real * this.real - z.imag * this.imag;
      z.imag = z.real * this.imag + z.imag * this.real;
      z.real = re;
      return z;
    }),
    pow2: function() {
      return complex(this.real * this.real - this.imag * this.imag,
                     2 * this.real * this.imag);
    },
    pow: zfunc(function(z) {
      var abs = this.abs();
      var theta = Math.atan2(this.imag, this.real);
      var mul = Math.pow(abs, z.real) * Math.exp(-z.imag * theta);
      var arg = z.real * theta + z.imag * Math.log(abs);
      z.real = mul * Math.cos(arg);
      z.imag = mul * Math.sin(arg);
      return z;
    }),
    sqrt: function() { return this.pow(0.5); },
    div: zfunc(function(z) {
      var den = z.real * z.real + z.imag * z.imag;
      var re = (this.real * z.real + this.imag * z.imag) / den;
      z.imag = (-this.real * z.imag + this.imag * z.real) / den;
      z.real = re;
      return z;
    }),
    abs: function() {
      return Math.sqrt(this.real * this.real +
                       this.imag * this.imag);
    },
    neg: function() {
      return complex(-this.real, -this.imag);
    },
    phase: function() {
      return Math.atan2(this.imag, this.real);
    },
    conjugate: function() {
      return complex(this.real, -this.imag);
    },
    toString: function() {
      return '(' + this.real + (this.imag < 0 ? '' : '+') +
             this.imag + 'j)';
    }
  });
  extend(complex, {
    exp: zfunc(function(z) {
      return complex.E.pow(z);
    }),
    log: zfunc(function(z) {
      var abs = z.abs();
      z.imag = Math.atan2(z.imag, z.real);
      z.real = Math.log(abs);
      return z;
    }),
    log10: zfunc(function(z) {
      return complex.log(z).div(complex.log(10));
    }),
    sin: zfunc(function(z) {
      var re = Math.sin(z.real) * Math.cosh(z.imag);
      z.imag = Math.cos(z.real) * Math.sinh(z.imag);
      z.real = re;
      return z;
    }),
    asin: zfunc(function(z) {
      return complex.log(
        complex.ONE.sub(z.pow2()).sqrt().add(z.mul(complex.I))
      ).mul(complex.NEGATIVE_I);
    }),
    asinh: zfunc(function(z) {
      return complex.log(z.add(z.pow2().add(complex.ONE).sqrt()));
    }),
    cos: zfunc(function(z) {
      var re = Math.cos(z.real) * Math.cosh(z.imag);
      z.imag = -Math.sin(z.real) * Math.sinh(z.imag);
      z.real = re;
      return z;
    }),
    acos: zfunc(function(z) {
      return complex.log(z.pow2().sub(complex.ONE).sqrt()
          .add(z)).mul(complex.NEGATIVE_I);
    }),
    acosh: zfunc(function(z) {
      return complex.log(z.add(
        z.add(complex.ONE).sqrt().mul(z.sub(complex.ONE).sqrt()))
      );
    }),
    tan: zfunc(function(z) {
      return complex.sin(z).div(complex.cos(z));
    }),
    atan: zfunc(function(z) {
      return complex.I.mul(
        complex.log(complex.ONE.sub(z.mul(complex.I))).sub(
          complex.log(complex.ONE.add(z.mul(complex.I)))
        )
      ).div(2);
    }),
    atanh: zfunc(function(z) {
      return complex.log(z.add(1)).sub(complex.log(complex.ONE.sub(z))).div(2);
    }),
    cosh: zfunc(function(z) {
      var re = Math.cosh(z.real) * Math.cos(z.imag);
      z.imag = Math.sinh(z.real) * Math.sin(z.imag);
      z.real = re;
      return z;
    }),
    sinh: zfunc(function(z) {
      var re = Math.sinh(z.real) * Math.cos(z.imag);
      z.imag = Math.cosh(z.real) * Math.sin(z.imag);
      z.real = re;
      return z;
    }),
    tanh: zfunc(function(z) {
      return complex.sinh(z).div(complex.cosh(z));
    }),
    polar: zfunc(function(z) {
      return [z.abs(), z.phase()];
    }),
    rect: function(a, b) {
      if (a instanceof Array)
        return this.rect.apply(this, a);
      return complex(a * Math.cos(b), a * Math.sin(b));
    }
  });
  ['E', 'LN10', 'LN2', 'LOG10E', 'LOG2E', 'PI', 'SQRT1_2', 'SQRT2']
    .forEach(function(mathConstant) {
      if (Math.hasOwnProperty(mathConstant))
        complex[mathConstant] = complex(Math[mathConstant], 0);
    });
  complex.ZERO = complex(1, 0);
  complex.ONE = complex(1, 0);
  complex.I = complex(0, 1);
  complex.NEGATIVE_I = complex(0, -1);
})();
