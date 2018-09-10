import { expect, assert } from 'chai';
import { proto, uint8, uint16, uint32, bson, string } from 'bytable';
import { Codec } from '../src';

describe('Codec', () => {
    interface IPayload {
        message: string;
        userId: number;
    }

    @proto
    class PostRequest {
        @string
        id: string;

        @uint8
        index: number;

        @uint16
        count: number;

        @bson
        payload: IPayload
    }

    const codec = new Codec(PostRequest);

    it('should convert message into binary and read it back', () => {
        const request = new PostRequest();
        request.id = 'guid';
        request.index = 42;
        request.count = 777;
        request.payload = {
            message: 'Hey there!',
            userId: 13
        }

        const binary = codec.write(request);
        expect(codec.read(binary)).to.deep.eq(request);
    });
});