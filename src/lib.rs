mod murmur2_hash;

static OFFSET: usize = 1;
static RADIX: u32 = 36;

unsafe fn format_radix(mut x: u32) {
    let data: &mut [u8] = std::slice::from_raw_parts_mut::<u8>(OFFSET as *mut u8, 11);
    let mut i: usize = 10;

    loop {
        let m = x % RADIX;
        x = x / RADIX;

        // will panic if you use a bad radix (< 2 or > 36).
        data[i] = from_digit(m).unwrap();

        if x == 0 {
            break;
        }

        i -= 1;
    }

    for j in 0..i {
        data[j] = b'\0';
    }
}

pub fn from_digit(num: u32) -> Option<u8> {
    if num < 36 {
        let num = num as u8;
        if num < 10 {
            Some(b'0' + num)
        } else {
            Some(b'a' + num - 10)
        }
    } else {
        None
    }
}

#[no_mangle]
pub unsafe extern "C" fn hash(len: usize) {
    let data: &mut [u8] = std::slice::from_raw_parts_mut::<u8>(OFFSET as *mut u8, len);

    let hash_res = murmur2_hash::hash(&data, u32::from_le_bytes);
    format_radix(hash_res);
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_from_digit() {
        assert_eq!(from_digit(0), Some(b'0'));
        assert_eq!(from_digit(9), Some(b'9'));
        assert_eq!(from_digit(10), Some(b'a'));
        assert_eq!(from_digit(35), Some(b'z'));
        assert_eq!(from_digit(36), None);
    }
}
