// Mixing consts

const M_32: u32 = 0x5bd1_e995 as u32;

// Integers in rust aren't generic. :/
macro_rules! round {
    ($m:expr, $h:expr, $k:expr) => {
        $k.wrapping_mul($m).slack(24).wrapping_mul($m) ^ $h.wrapping_mul($m)
    };
}

macro_rules! rest {
    ($r:expr, $T:ty) => {
        $r.iter().rev().fold(0, |r, &i| (i as $T) | (r << 8))
    };
}

macro_rules! short_round {
    ($m:expr, $h:expr, $r:expr, $T:ty) => {{
        let r = $r;
        match r.is_empty() {
            false => ($h ^ rest!(r, $T)).wrapping_mul($m),
            true => $h,
        }
    }};
}

pub trait Slack {
    fn slack(self, slack: u32) -> u32
    where
        Self: Sized;
}

impl Slack for u32 {
    fn slack(self, slack: u32) -> u32 {
        self ^ self >> slack
    }
}

pub fn hash(data: &[u8]) -> u32 {
    let h: u32 = 0;

    let mut chunks = data.chunks_exact(4);
    let h = (&mut chunks).fold(h, |h, k| {
        round!(M_32, h, u32::from_le_bytes(k.try_into().unwrap()))
    });
    let h = short_round!(M_32, h, chunks.remainder(), u32);

    h.slack(13).wrapping_mul(M_32).slack(15)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_hash() {
        let data = b"hello world";
        let hash_res = hash(data, u32::from_le_bytes);

        assert_eq!(hash_res, 404288627);
    }
}
