use radix_fmt::radix_36;
mod murmur2_hash;

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

fn format_radix(mut x: u32, radix: u32) -> Vec<u8> {
    let mut result: Vec<u8> = vec![];

    loop {
        let m = x % radix;
        x = x / radix;

        // will panic if you use a bad radix (< 2 or > 36).
        result.push(from_digit(m).unwrap());

        if x == 0 {
            break;
        }
    }
    result.into_iter().rev().collect()
}

fn main() {
    let data = String::from("hello").as_bytes().to_owned();
    let hash_res = murmur2_hash::hash(&data, u32::from_le_bytes);
    let res = radix_36(hash_res);

    dbg!(hash_res);
    dbg!(res.to_string());
    dbg!(format_radix(hash_res, 36));
}
