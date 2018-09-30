import { expect, assert } from 'chai';
import { proto, i8, u8 } from 'bytable';
import { Codec } from '../src';

describe('e2e', () => {
    @proto
    class Foo {
        @i8 bar: number;
        @u8 positive: number;

        public write = () => Codec.create(Foo).write(this);
        public static read = (buf: ArrayBuffer): Foo => Codec.create(Foo).read(buf);
    }

    describe('read/write methods', () => {
        it('should handle static types', () => {
            const foo = new Foo();
            foo.bar = -42;
            foo.positive = 12;
            const buf = foo.write();
            const foo2 = Foo.read(buf);
            expect(foo.bar).to.eq(foo2.bar);
            expect(foo.positive).to.eq(foo2.positive);
        });

        it('should handle static types', () => {
            const foo = new Foo();
            foo.bar = -12;
            foo.positive = 42;
            const buf = foo.write();
            const foo2 = Foo.read(buf);
            expect(foo.bar).to.eq(foo2.bar);
            expect(foo.positive).to.eq(foo2.positive);
        });
    });

    describe('extends another class', () => {
        @proto
        class Foo2 extends Foo {
            @i8 bar2: number;

            public write = () => Codec.create(Foo2).write(this);
            public static read = (buf: ArrayBuffer): Foo2 => Codec.create(Foo2).read(buf);
        }

        it('should read Foo members and Foo2 members', () => {
            const foo = new Foo2();
            foo.bar = -42;
            foo.positive = 12;
            foo.bar2 = 7;
            const buf = foo.write();
            const foo2 = Foo2.read(buf);
            expect(foo.bar).to.eq(foo2.bar);
            expect(foo.positive).to.eq(foo2.positive);
            expect(foo.bar2).to.eq(foo2.bar2);
        });

        it('should be able to cast to Foo', () => {
            const foo = new Foo2();
            foo.bar = -42;
            foo.positive = 12;
            foo.bar2 = 7;
            const buf = foo.write();
            const foo2 = Foo.read(buf);
            expect(foo.bar).to.eq(foo2.bar);
            expect(foo.positive).to.eq(foo2.positive);
        });
    });
});